import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegistrationUserDto {
  @IsNotEmpty()
  @IsString()
    fullName: string;

  @IsEmail()
    email: string;

  @IsString()
  @IsNotEmpty()
    password: string;
}
