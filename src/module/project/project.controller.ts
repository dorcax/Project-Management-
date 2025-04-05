import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AuthGuard } from '../auth/guards/AuthGuard';
import { RoleGuard } from '../auth/guards/role.guard';
import { RolesandPermissions } from '../auth/decorator/role.decorator';
import { Role } from '../auth/entities/role.entity';
import { Permission } from '../auth/entities/permission.entity';
import { Workspace } from '../workspace/entities/workspace.entity';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(AuthGuard, RoleGuard)
  @RolesandPermissions([Role.OWNER], [Permission.CREATE_PROJECT])
  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    return this.projectService.create(createProjectDto, req);

  }

  @UseGuards(AuthGuard, RoleGuard)
  @RolesandPermissions([Role.OWNER, Role.ADMIN], [Permission.EDIT_PROJECT])
  @Get(':workspaceId')
  findAll(@Param('workspaceId') workspaceId: string, @Req() req) {
    return this.projectService.findAllProjects(workspaceId, req);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @RolesandPermissions([Role.OWNER, Role.ADMIN], [Permission.EDIT_PROJECT])
  @Get(':workspace/:projectId')
  findOne(

    @Param('workspace') WorkspaceId: string,
    @Req() req,
    @Param('projectId') projectId: string,
  ) {
    return this.projectService.findOne(WorkspaceId, projectId, req);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @RolesandPermissions([Role.OWNER, Role.ADMIN], [Permission.EDIT_PROJECT])
  @Patch(':projectId')
  update(
    @Req() req,
    @Param('projectId') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.updateProject(projectId, req, updateProjectDto);
  }

  @UseGuards(AuthGuard, RoleGuard)
  @RolesandPermissions([Role.OWNER, Role.ADMIN], [Permission.DELETE_PROJECT])
  @Delete(':workspace/:projectId')
  remove(
    @Param('workspace') WorkspaceId: string,
    @Req() req,
    @Param('projectId') projectId: string,
  ) {
    return this.projectService.removeProject(WorkspaceId, projectId, req);
  }
}
