import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [DbModule, AuthModule, EmailModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
