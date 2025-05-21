import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDTO } from './dtos/login.dto';
import { AuthGuard } from 'src/guard/jwt.guard';
import { SignUpDTO } from './dtos/signup.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/passwordHassing')
    passwordHassing(@Body('password') password: string) {
        return this.authService.passwordHassing(password);
    }

    @Post('/login')
    login(@Body() loginData : LogInDTO, @Req() req, @Res() res) {
            return this.authService.login(loginData, req, res);
    }

     @Post('/signup')
    async signUp(@Body() signupData:SignUpDTO){      
        return this.authService.signUp(signupData);
    }

    @UseGuards(AuthGuard)
    @Post("/logout")
        logout(@Req() req, @Res() res) {
            return this.authService.logout(req, res);
        }

        



}
