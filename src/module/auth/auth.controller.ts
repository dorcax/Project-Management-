import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, LoginAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from './guards/AuthGuard';
import { RoleGuard } from './guards/role.guard';
import { RolesandPermissions } from './decorator/role.decorator';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { Public } from '@prisma/client/runtime/library';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';

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

  @Get('one')
  @UseGuards(AuthGuard, RoleGuard)
  @RolesandPermissions([Role.ADMIN, Role.OWNER], [Permission.CREATE_PROJECT])
  findOne() {
    return this.authService.findOne();
  }
  @Get("alluser")
  findAllUser(){
    return this.authService.findallUser()
  }

  //  oauth authentication

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  // callback url
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req) {
    console.log('Google User Data:', req.user);

    const jwt = await this.authService.generateJwt(req.user);
    console.log('Generated JWT:', jwt);

    const user = await this.authService.validateGoogleUser(req.user);

    return {
      message: 'Google login successful',
      jwtToken: jwt,
      user,
    };
  }

  @Post('google/validate')
  validateGoogleUser(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.validateGoogleUser(createAuthDto);
  }



}
