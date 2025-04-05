import { IsNotEmpty, IsString } from "class-validator"

export class CreateMemberDto {
  @IsString()
  @IsNotEmpty()
  inviteCode: string;
}
