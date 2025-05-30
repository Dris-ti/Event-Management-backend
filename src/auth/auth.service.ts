import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { LOGIN } from '../db/entities/login.entity';
import * as bcrypt from 'bcrypt';
import { SignUpDTO } from './dtos/signup.dto';
import { USER } from 'src/db/entities/user.entity';
import { LogInDTO } from './dtos/login.dto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(LOGIN)
    private login_Repo: Repository<LOGIN>,
    @InjectRepository(USER)
    private user_Repo: Repository<USER>,
  ) {}

  passwordHassing(password: string) {
    return bcrypt.hash(password, 10);
  }

  generateAccessToken(user) {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const expiry = process.env.ACCESS_TOKEN_EXPIRY;

    if (!secret) {
      throw new Error(
        'EMAIL_VERIFICATION_SECRET is not defined in environment variables.',
      );
    }
    return jwt.sign(
      // Payload
      {
        id: user.id,
        email: user.email,
        name: user.user_id.name,
        type: user.user_id.user_type,
      },
      secret, // Secret
      {
        expiresIn: expiry, // Expiry time
      },
    );
  }

  async login(loginData: LogInDTO, req, res) {
    const { email, password } = loginData;

    // Find user
    const user = await this.login_Repo.findOne({
      where: { email: email }, // Ensure the user relation is fetched
      relations: ['user_id'],
    });

    console.log('user', user);

    if (!user) {
      return res.status(401).json({
        success: false,
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        error: {
          message: 'The email or password you entered is incorrect.',
        },
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user['password']);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'The email or password you entered is incorrect.',
        },
      });
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user);

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    };

    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .header('Authorization', `Bearer ${accessToken}`)
      .json({
        success: true,
        message: 'User logged in successfully.',
        data: user.user_id.user_type,
      });
  }

  async signUp(signupData: SignUpDTO) {
    const { name, email, password } = signupData;

    // Check if user already exists
    const existingUser = await this.user_Repo.findOne({
      where: { email: email },
    });

    if (existingUser) {
      throw new BadGatewayException('The email is already in use.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await this.user_Repo.create({
      name,
      email,
      user_type: 'user',
    });

    await this.user_Repo.save(newUser);

    // Create login entry
    const newLogin = await this.login_Repo.create({
      email,
      password: hashedPassword,
      user_id: newUser,
    });

    await this.login_Repo.save(newLogin);

    return {
      success: true,
      message: 'User registered successfully.',
      status: 201,
    };
  }

  async logout(req, res) {
    // Clear the cookie
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    return res.status(200).json({
      success: true,
      message: 'Logout Successful.',
    });
  }

  async getUserInfo(req, res) {
    const user = await this.user_Repo.findOne({
      where: { email: req.email },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not Found!' });
    }
    return res.status(201).json({
      message: 'Email exits',
      status: 200,
      data: user,
    });
  }
}
