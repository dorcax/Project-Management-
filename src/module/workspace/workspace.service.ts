import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { PrismaService } from 'src/prisma.services';
import { nanoid } from 'nanoid';
import { connect } from 'http2';
@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createWorkspaceDto: CreateWorkspaceDto, req) {
    try {
      const { name, description } = createWorkspaceDto;
      const inviteCode = await this.generateInviteCode();
      const workspace = await this.prisma.workspace.create({
        data: {
          name,
          description,
          inviteCode,
          owner: {
            connect: {
              id: req.user.sub,
            },
          },
        },
      });

      console.log('usserr', req.user.roles);
      const role = Array.isArray(req.user.roles)
        ? req.user.roles[0]
        : req.user.roles;

      // create  add membership to it
      const member = await this.prisma.member.create({
        data: {
          user: {
            connect: {
              id: req.user.sub,
            },
          },
          workspace: {
            connect: {
              id: workspace.id,
            },
          },
          role: role,
        },
      });

      //  update the current workspace
      const currentWorkSpace = await this.prisma.workspace.update({
        where: {
          id: workspace.id,
        },
        data: {
          members: {
            connect: {
              id: member.id,
            },
          },
        },
      });

      return {
        message: 'workspace created successfully',
        workspace,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Something went wrong',
      );
    }
  }

  //********************************
  // GET ALL MEMEBERS IN WORKSPACE
  //**************** **************/

  async findAll(req) {
    try {
      const memberDetails = await this.prisma.member.findMany({
        where: {
          userId: req.user.sub,
        },
        include: {
          workspace: true,
        },
      });
      if (memberDetails.length === 0) {
        throw new NotFoundException('no workspaces found');
      }

      const workspace = memberDetails.map((workspace) => workspace.workspace);
      return {
        workspace,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Something went wrong',
      );
    }
  }

  // get  workspace by id and all its members
  async findOne(workspaceId, req) {
    try {
      const workspace = await this.prisma.workspace.findMany({
        where: {
          id: workspaceId,
        },
        include: {
          members: true,
        },
      });
      if (!workspace) {
        throw new NotFoundException('workspace not found');
      }
      return workspace;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'something went wrong',
      );
    }
  }

  //   Get Workspace Analytics (getWorkspaceAnalyticsService)
  // Step 1: Get the current date.

  // Step 2: Count total tasks for the workspace.

  // Step 3: Count overdue tasks (dueDate < currentDate and status !== DONE).

  // Step 4: Count completed tasks (status === DONE).

  // Step 5: Return analytics object.

  async update(workspaceId, req, updateWorkspaceDto: UpdateWorkspaceDto) {
    try {
      const { name, description } = updateWorkspaceDto;
      // check if the workspace exist
      const existingWorkspace = await this.prisma.workspace.findFirst({
        where: {
          id: workspaceId,
          ownerId: req.user.sub,
        },
      });
      if (!existingWorkspace) {
        throw new NotFoundException('no workspace found or unauthorized');
      }
      const workspace = await this.prisma.workspace.update({
        where: {
          id: workspaceId,
        },
        data: {
          name,
          description,
        },
      });

      return workspace;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'something went wrong',
      );
    }
  }

  async remove(workspaceId, req) {
    return this.prisma.$transaction(async (prisma) => {
      const existingWorkspace = await prisma.workspace.findUnique({
        where: {
          id: workspaceId,
        },
        include: {
          members: true,
        },
      });
      if (!existingWorkspace) {
        throw new NotFoundException('no workspace found or unauthorized');
      }

      //  Verify if the requesting user is the owner
      if (existingWorkspace.ownerId !== req.user.sub) {
        throw new BadRequestException(
          'Only the owner can delete this workspace',
        );
      }
      const workspace = await this.prisma.workspace.delete({
        where: {
          id: workspaceId,
        },
      });

      return {
        message: 'workspace deleted successfully',
      };
    });
  }

 async generateInviteCode() {
    let inviteCode;
    let exist = true;

    while (exist) {
      inviteCode = nanoid(8);
      const existingCode = await this.prisma.workspace.findUnique({
        where: {
          inviteCode,
        },
      });
      exist = !!existingCode;
    }
    return inviteCode;
  }
}
