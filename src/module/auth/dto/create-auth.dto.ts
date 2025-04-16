import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"



export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  
}


export class LoginAuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
  
  @IsOptional()
  @IsString()
  inviteCode?: string;
}