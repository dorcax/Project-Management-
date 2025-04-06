import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma.services';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}
  async createTask(createTaskDto: CreateTaskDto, req) {
    try {
      const {
        title,
        description,
        status,
        priority,
        workspaceId,
        projectId,
        assigneeId,
        dueDate,
      } = createTaskDto;
      //  find project if they exist
      const project = await this.prisma.project.findFirst({
        where: {
          id: projectId,
          workspaceId: workspaceId,
        },
      });

      if (!project) {
        throw new NotFoundException('no project found');
      }
      // if assignee to

      if (assigneeId) {
        const isAssignedUserMember = await this.prisma.member.findFirst({
          where: {
            userId: assigneeId,
            workspaceId: workspaceId,
          },
        });
        if (!isAssignedUserMember) {
          throw new BadRequestException(
            'Assigned user is not a member of this workspace.',
          );
        }
      }

      // create task
      const task = await this.prisma.task.create({
        data: {
          title,
          description,
          priority,
          status,
          dueDate,
          assigneeId,
          projectId,
          workspaceId,
          createdById: req.user.sub,
        },
      });
      return {
        message: 'task created successfully ',
        task,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'something went wrong ',
      );
    }
  }

  async findAll(projectId, req) {
    try {
      // find the project
      const project = await this.prisma.project.findUnique({
        where: {
          id: projectId,
        },
      });
      if (!project) {
        throw new NotFoundException('project not found');
      }
      //  find all task
      const task = await this.prisma.task.findMany({
        where: {
          createdById: req.user.sub,
        },
      });

      if (task.length === 0) {
        throw new NotFoundException('no tasks found ');
      }
      return task;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'something went wrong',
      );
    }
  }

  async findOne(projectId, taskId) {
    try {
      // find the project
      const project = await this.prisma.project.findUnique({
        where: {
          id: projectId,
        },
      });
      if (!project) {
        throw new NotFoundException('project not found');
      }

      //  find singlee task
      const task = await this.prisma.task.findUnique({
        where: {
          id: taskId,
          projectId,
        },
      });
      if (!task) {
        throw new NotFoundException('task not found ');
      }
      return task;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'something went wrong',
      );
    }
  }

  async update(taskId, updateTaskDto: UpdateTaskDto, req) {
    try {
      const {
        title,
        description,
        status,
        priority,
        workspaceId,
        projectId,
        assigneeId,
        dueDate,
      } = updateTaskDto;
      // find project and workspace
      const project = await this.prisma.project.findUnique({
        where: {
          id: projectId,
        },
        include: { workspace: true },
      });
      if (!project || project.workspace.id !== workspaceId) {
        throw new NotFoundException('Project not found in this workspace');
      }

      //  update the task
      const task = await this.prisma.task.update({
        where: {
          id: taskId,
        },
        data: {
          title,
          description,
          status,
          priority,
          workspaceId,
          projectId,
          assigneeId,
          dueDate,
          createdById: req.user.sub,
        },
      });
     
      return task;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'something went wrong',
      );
    }
  }

  async remove(projectId,taskId) {
try {
  // find project and workspace
  const project = await this.prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: { tasks: true },
  });
 const task = project?.tasks.find((task) => task.id === taskId);
 if (!task) {
   throw new NotFoundException('Task not found in this project');
 }
  const taskDelete=await this.prisma.task.delete({
    where:{
      id:taskId,
      projectId
    }
  })

  return taskDelete
} catch (error) {
  throw new InternalServerErrorException(
    error.message || 'something went wrong',
  );
}
  }
}
