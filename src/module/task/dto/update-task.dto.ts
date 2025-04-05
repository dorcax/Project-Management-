import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { Priority, TaskStatus } from "@prisma/client"
import { IsEnum, IsNotEmpty, IsString } from "class-validator"
export class UpdateTaskDto extends PartialType(CreateTaskDto) {
     @IsString()
      @IsNotEmpty()
      title: string;
      @IsString()
      @IsNotEmpty()
      description: string;
    
      @IsEnum(TaskStatus)
      status: TaskStatus;
    
      @IsEnum(Priority)
      priority: Priority;
    
    
      @IsString()
      @IsNotEmpty()
      projectId: string;
    
      @IsString()
      @IsNotEmpty()
      workspaceId: string;
    
      dueDate:Date
    
      assigneeId:string
}
