import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, LoginAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from './guards/AuthGuard';
import { RoleGuard } from './guards/role.guard';
import { RolesandPermissions } from './decorator/role.decorator';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get('one')
  @UseGuards(AuthGuard, RoleGuard)
  @RolesandPermissions([Role.ADMIN, Role.OWNER], [Permission.CREATE_PROJECT])
  // @RolesAndPermissions([Role.ADMIN, Role.MANAGER], [Permission.READ_PROJECTS])
  findOne() {
    return this.authService.findOne();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
