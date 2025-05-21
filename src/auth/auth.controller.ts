import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDTO } from './dtos/login.dto';
import { AuthGuard } from 'src/guard/jwt.guard';
import { SignUpDTO } from './dtos/signup.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/login')
    login(@Body() loginData : LogInDTO, @Req() req, @Res() res) {
            return this.authService.login(loginData, req, res);
    }

     @Post('/signup')
    async signUp(@Body() signupData:SignUpDTO){      
        return this.authService.signUp(signupData);
    }

}
