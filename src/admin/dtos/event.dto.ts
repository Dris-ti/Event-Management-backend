import { IsString, IsOptional, IsDateString, IsNumber, IsArray } from 'class-validator';

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
  max_seats: number;

  @IsNumber()
  available_seats: number;

  // @IsOptional()
  // @IsString()
  // image_url?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tag?: string[] | string; 
}
