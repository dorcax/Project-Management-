import { IsNotEmpty, IsString } from "class-validator"

export class CreateProjectDto {
    
    
    @IsString()
    @IsNotEmpty()
    name:string

    @IsString()
    @IsNotEmpty()
    emoji:string

    @IsNotEmpty()
    @IsString()
    description:string

    @IsNotEmpty()
    @IsString()
    workspaceId:string
}
