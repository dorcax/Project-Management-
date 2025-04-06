import { Controller, Get, Post, Body, Patch, Param, Delete ,Req} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() req) {
    return this.taskService.createTask(createTaskDto, req);
  }

  @Get(':projectId')
  findAll(@Param('projectId') projectId: string, @Req() req) {
    return this.taskService.findAll(projectId, req);
  }

  @Get(':projectId/taskId')
  findOne(
    @Param('taskId') taskId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.taskService.findOne(projectId, taskId);
  }

  @Patch(':taskId')
  update(
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req,
  ) {
    return this.taskService.update(taskId, updateTaskDto, req);
  }

  @Delete(':projectId/taskId')
  remove(
    @Param('taskId') taskId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.taskService.remove(projectId,taskId);
  }
}
