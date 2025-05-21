import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([
          
        ]), 
        TypeOrmModule.forRoot(

          {
            type: 'postgres',
            host: process.env.DB_HOST,
            port: +(process.env.DB_PORT ?? 5432),
            username: process.env.DB_USER ?? "postgres",
            password: process.env.DB_PASS ?? "root",
            database: process.env.DB_NAME,
            entities: [__dirname + '/../database/entities/*.entity.{js,ts}'],
            autoLoadEntities: true, // Enable automatic entity loading
            synchronize: true,
            logging:false,
          },
        ),
      ],
      exports: [TypeOrmModule], 
      controllers: [],
      providers: [],
})
export class DbModule {}
