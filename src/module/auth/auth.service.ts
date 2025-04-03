import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException
} from '@nestjs/common';
import { CreateAuthDto, LoginAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma.services';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ownerDefaultPermissions, Role } from './entities/role.entity';
import { WorkspaceService } from '../workspace/workspace.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly workspaceService: WorkspaceService,
  ) {}
  async create(createAuthDto: CreateAuthDto) {
    try {
      const { name, email, password } = createAuthDto;
      // find if user already registered
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (existingUser) {
        throw new ConflictException('email  already exist ');
      }

      // hash password
      const hashedPassword = await argon2.hash(password);
      // create new user
      const newUser = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          roles: {
            create: {
              role: [Role.OWNER],
              permission: ownerDefaultPermissions,
            },
          },
        },
        include: {
          roles: true,
        },
      });
      // const { password: _, ...rest } = newUser;
      // create new workspcae
      const inviteCode = await this.workspaceService.generateInviteCode();
      const workspace = await this.prisma.workspace.create({
        data: {
          name: 'My workspace',
          description: `workspace created for ${newUser.name}`,
          inviteCode: inviteCode,
          owner: {
            connect: {
              id: newUser.id,
            },
          },
        },
      });

      // create a new membership for the user
      const member = await this.prisma.member.create({
        data: {
          workspaceId: workspace.id,
          userId: newUser.id,
          role:[Role.OWNER],
        },
      });
      return { message: 'user successfully registered' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message ||'something went wrong');
    }
  }

  // login
  async login(loginAuthDto: LoginAuthDto) {
    try {
      const { email, password } = loginAuthDto;

      // find if user exist

      const existingUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          roles: true,
        },
      });
      if (!existingUser) {
        throw new NotFoundException('user not found');
      }

      // verify thhe password
      const isMatch = await argon2.verify(existingUser.password, password);
      if (!isMatch) throw new UnauthorizedException('invalid credentials');
      const token = await this.generateJwt(existingUser);
      return {
        user: existingUser,
        token: token,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('something went wrong');
    }
  }

  findOne() {
    return `This action returns a  auth`;
  }

  //  validate user if user is already in our database
  async validateGoogleUser(googleUser: CreateAuthDto) {
  try {
      if (!googleUser.email || !googleUser.name) {
        throw new BadRequestException(
          'Google user must have an email and name',
        );
      }
      const user = await this.prisma.user.findUnique({
        where: {
          email: googleUser.email,
        },
        include: { roles: true },
      });
      if (user) return user;
      const newUser = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          password: '',
          roles: {
            create: {
              role: [Role.OWNER],
              permission: ownerDefaultPermissions,
            },
          },
        },
        include: {
          roles: true,
        },
      });
      console.log('New User:', newUser);

      // create new workspcae
      const inviteCode = await this.workspaceService.generateInviteCode();
      const workspace = await this.prisma.workspace.create({
        data: {
          name: 'My workspace',
          description: `workspace created for ${newUser.name}`,
          inviteCode: inviteCode,
          owner: {
            connect: {
              id: newUser.id,
            },
          },
        },
      });

      // create a new membership for the user
      const userRole =
        newUser.roles.length > 0 ? newUser.roles[0].role : undefined;
      const member = await this.prisma.member.create({
        data: {
          workspaceId: workspace.id,
          userId: newUser.id,
          role: userRole,
        },
      });
      console.log('workspace', workspace);
      console.log('member', member);
      return { message: 'user logged in', workspace, member };
  } catch (error) {
      console.error('Workspace/Member Creation Error:', error);
      throw new InternalServerErrorException(
        'Failed to create workspace or member',
      );
  }
   }

  async generateJwt(existingUser: any) {
    // Extract roles and permissions
    // console.log('User object in generateJwt:', existingUser);
    const roles = existingUser.roles.map((role) => role.role);
   
   
    const permissions = existingUser.roles.flatMap((role) => role.permission);
    // console.log('permissions', permissions);
    const payload = {
      sub: existingUser.id,
      email: existingUser.email,
      roles:roles,
      permissions,
    };
    //  console.log('roles', payload);
    return this.jwt.signAsync(payload); 
  }


  async findallUser(){
    const users =await this.prisma.user.findMany({
      include:{
        members:true,
        workspaces:true,
        roles:true
      }
    })
    return users
  }
}
