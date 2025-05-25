import { Jwt } from './../../node_modules/@types/jsonwebtoken/index.d';
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { DbModule } from 'src/db/db.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/email/email.module';
import { LOGIN } from 'src/db/entities/login.entity';
import { USER } from 'src/db/entities/user.entity';
import { EVENT } from 'src/db/entities/event.entity';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthController } from 'src/auth/auth.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
      DbModule,
      TypeOrmModule.forFeature([LOGIN, USER, EVENT]),
      EmailModule,
      AuthModule
    ],
  controllers: [AdminController, AuthController],
  providers: [AdminService, JwtService,EmailService, AuthService]
})
export class AdminModule {}
