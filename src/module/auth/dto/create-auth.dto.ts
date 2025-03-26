import { IsNotEmpty, IsString } from "class-validator"

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
}
