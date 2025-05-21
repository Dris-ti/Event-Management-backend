import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DbModule } from 'src/db/db.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LOGIN } from 'src/db/entities/login.entity';
import { USER } from 'src/db/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    DbModule,
    TypeOrmModule.forFeature([LOGIN, USER]),
    EmailModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, EmailService],
})
export class AuthModule {}
