import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
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
