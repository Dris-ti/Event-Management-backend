import { UserService } from './../user/user.service';
import { LOGIN } from './entities/login.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USER } from './entities/user.entity';
import { EVENT } from './entities/event.entity';
import { BOOKING } from './entities/booking.entity';
import { UserModule } from 'src/user/user.module';
import { AdminModule } from 'src/admin/admin.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from 'src/user/user.controller';
import { AdminController } from 'src/admin/admin.controller';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/admin/admin.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthController } from 'src/auth/auth.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
          USER,
          LOGIN,
          EVENT,
          BOOKING
        ]), 
        TypeOrmModule.forRoot(

          {
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +(process.env.DB_PORT ?? 5432),
            username: process.env.DB_USER ?? "postgres",
            password: process.env.DB_PASS ?? "root",
            database: process.env.DB_NAME ?? "event_management",
            entities: [__dirname + '/../database/entities/*.entity.{js,ts}'],
            autoLoadEntities: true, // Enable automatic entity loading
            synchronize: true,
            logging:false,
          },
        ),
        CloudinaryModule
      ],
      exports: [TypeOrmModule], 
      controllers: [UserController, AdminController, AuthController],
      providers: [JwtService, UserService, AdminService, AuthService],
})
export class DbModule {}
