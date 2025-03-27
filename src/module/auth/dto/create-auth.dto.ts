import { IsNotEmpty, IsString } from "class-validator"
import { Role } from "@prisma/client";
// import { Permission } from "../entities/permission.entity";
import { Permission } from '@prisma/client';

export class CreateAuthDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;


  @IsNotEmpty()
  @IsString()
  password: string;

  role:Role
  permission:Permission
}



export class LoginAuthDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}