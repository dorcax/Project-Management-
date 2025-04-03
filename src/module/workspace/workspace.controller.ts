import { Controller, Get, Post, Body, Patch, Param, Delete,Req, UseGuards } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { AuthGuard } from '../auth/guards/AuthGuard';
import { RolesandPermissions } from '../auth/decorator/role.decorator';
import { RoleGuard } from '../auth/guards/role.guard';
import { Permission } from '../auth/entities/permission.entity';
import { Role } from '../auth/entities/role.entity';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @RolesandPermissions([Role.ADMIN], [Permission.CREATE_WORKSPACE])
  @Post()
  create(@Body() createWorkspaceDto: CreateWorkspaceDto, @Req() req) {
    return this.workspaceService.create(createWorkspaceDto, req);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @RolesandPermissions([Role.ADMIN], [Permission.VIEW_ONLY])
  @Get()
  findAll(@Req() req) {
    return this.workspaceService.findAll(req);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @RolesandPermissions([Role.ADMIN], [Permission.VIEW_ONLY])
  @Get(':workspaceId')
  findOne(@Param('workspaceId') workspaceId: string, @Req() req) {
    return this.workspaceService.findOne(workspaceId, req);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @RolesandPermissions([Role.ADMIN], [Permission.EDIT_WORKSPACE])
  @Patch(':workspaceId')
  update(
    @Param('workspaceId') workspaceId: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    @Req() req,
  ) {
    return this.workspaceService.update(workspaceId, updateWorkspaceDto, req);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @RolesandPermissions([Role.ADMIN], [Permission.DELETE_WORKSPACE])
  @Delete(':workspaceId')
  remove(@Param('workspaceId') workspaceId: string, @Req() req) {
    return this.workspaceService.remove(workspaceId, req);
  }
}
