import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class EventDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString() // You may want to validate time with regex if needed
  time?: string;

  @IsNumber()
  total_seats: number;

  @IsNumber()
  available_seats: number;

  @IsOptional()
  @IsString()
  image_url?: string;
}
