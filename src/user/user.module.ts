import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbModule } from 'src/db/db.module';
import { EVENT } from 'src/db/entities/event.entity';
import { LOGIN } from 'src/db/entities/login.entity';
import { USER } from 'src/db/entities/user.entity';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { BOOKING } from 'src/db/entities/booking.entity';

@Module({
  imports: [
        DbModule,
        TypeOrmModule.forFeature([LOGIN, USER, EVENT, BOOKING]),
        EmailModule
      ],
  controllers: [UserController],
  providers: [UserService, JwtService,EmailService]
})
export class UserModule {}
