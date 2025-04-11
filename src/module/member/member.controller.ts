import { Controller, Get, Post, Body, Patch, Param, Delete, Query ,Req, UseGuards} from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { AuthGuard } from '../auth/guards/AuthGuard';
import { RoleGuard } from '../auth/guards/role.guard';
import { RolesandPermissions } from '../auth/decorator/role.decorator';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}
  
  // @UseGuards(AuthGuard)
  // // @RolesandPermissions()
  // @Post()
  // create(@Body() createMemberDto:CreateMemberDto,@Req() req) {
  //   const userId=req.user.sub
  //   return this.memberService.joinAWorkspaceByInvite(createMemberDto,userId);
  // }

  @Get()
  findAll() {
    return this.memberService.findAll();
  }

  @Get(':userId/:workkspaceId')
  findOne(@Param('userId') userId: string,@Param("workspaceId") workspaceId:string) {
    return this.memberService.findOne(userId,workspaceId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.memberService.update(+id, updateMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memberService.remove(+id);
  }
}
