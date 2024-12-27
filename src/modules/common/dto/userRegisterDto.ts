import {
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsPhoneNumber(null)
  phone?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
