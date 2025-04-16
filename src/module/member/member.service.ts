import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { PrismaService } from 'src/prisma.services';
import { memberDefaultPermission, Role } from '../auth/entities/role.entity';

@Injectable()
export class MemberService {
  constructor(private readonly prisma:PrismaService){}
 async joinAWorkspaceByInvite(createMemberDto
  :CreateMemberDto,userId) {
    const{inviteCode} =createMemberDto
   const transaction=await this.prisma.$transaction(async(prisma)=>{
    try {
      // find workspace by invite
      const workspace = await prisma.workspace.findUnique({
        where: {
          inviteCode: inviteCode,
        },
      });
      if (!workspace) {
        throw new NotFoundException('invalid inviteCode or workspace found');
      }

      //  check if member is already a member
      const existingMember = await prisma.member.findFirst({
        where: {
          workspaceId: workspace.id,
          userId: userId,
        },
      });

      if (existingMember) {
        throw new BadRequestException(
          'you are already a member of this workspace',
        );
      }

      // add user to a workspace
      const newMember = await prisma.member.create({
        data: {
          userId: userId,
          workspaceId: workspace.id,
          role: {
            create: {
              role: [Role.MEMBER],
              permission: memberDefaultPermission,
            },
          },
        },
      });
      // update thier current workspace
      const currentWorkspace = await prisma.user.update({
        where: {
          id:userId,
        },
        data: {
          currentWorkspaceId: workspace.id,
        },
      });
      return {
        message: 'you have successfully joined the workspace',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'something went wrong',
      );
    }
   })
   return transaction
  }

  findAll() {
    return `This action returns all member`;
  }

  async findOne(userId,workspaceId) {
    try {
      const isMember = await this.prisma.member.findFirst({
        where: {
          userId: userId,
          workspaceId
        },
      });

      if(!isMember){
        throw new NotFoundException("user does not belong to this worksplace")
      }
      return isMember
    } catch (error) {
      throw new InternalServerErrorException(error.message ||"something went wrong")
    }
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }
}
