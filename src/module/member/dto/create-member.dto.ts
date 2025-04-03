import { IsNotEmpty, IsString } from "class-validator"

export class CreateMemberDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  workspaceId: string;
  
  @IsString()
  @IsNotEmpty()
  inviteCode: string;
}
