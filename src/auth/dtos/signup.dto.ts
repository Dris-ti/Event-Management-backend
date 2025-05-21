import {
  IsString,
  IsEmail,
  IsNotEmpty,
  Length,
  MinLength,
  Matches,
} from 'class-validator';

export class SignUpDTO {
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(1, 100)
  email: string;

  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[0-9])/, {
    message: 'Password must contain atleast 1 number!',
  })
  password: string;
}