import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { PrismaService } from 'src/prisma.services';

@Injectable()
export class MemberService {
  constructor(private readonly prisma:PrismaService){}
 async joinAWorkspaceByInvite(createMemberDto: CreateMemberDto) {
   try {
    const{userId,workspaceId,inviteCode} =createMemberDto
    // find workspace by invite
     const workspace =await this.prisma.workspace.findUnique({
      where:{
        inviteCode:inviteCode
      }
     })
     if(!workspace){
      throw new NotFoundException("invalid inviteCode or workspace found")
     }

    //  check if member is already a member 
    const existingMember =await this.prisma.member.findFirst({
      where:{
        workspaceId:workspaceId,
        userId:userId
      }
    })

    if(existingMember){
      throw new BadRequestException("you are already a member of thiks workspace")
    }


    // add user to a workspace
    const newMember =await this.prisma.member.create({
      data:{
        userId,
        workspaceId
      }
    })
    return {
      message:"you have successfully joined the workspace"
    }
   } catch (error) {
    throw new InternalServerErrorException(error.message ||"something went wrong")
   }
  }

  findAll() {
    return `This action returns all member`;
  }

  findOne(id: number) {
    return `This action returns a #${id} member`;
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }
}
