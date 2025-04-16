import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAuthDto, LoginAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma.services';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import {
  memberDefaultPermission,
  ownerDefaultPermissions,
  Role,
} from './entities/role.entity';
import { WorkspaceService } from '../workspace/workspace.service';
import { MemberService } from '../member/member.service';
import { permission } from 'process';


@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly workspaceService: WorkspaceService,
    private readonly memberService: MemberService,
  ) {}
  async create(createAuthDto: CreateAuthDto) {
    const { name, email, password } = createAuthDto;

    const transaction = await this.prisma.$transaction(async (prisma) => {
      try {
        // find if user already registered
        const existingUser = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (existingUser) {
          throw new ConflictException('email  already exist ');
        }

        // hash password
        const hashedPassword = await argon2.hash(password);

        //  create new user
        const newUser = await prisma.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        });

        // create new workspace
        const generateInviteCode =
          await this.workspaceService.generateInviteCode();
        const workspace = await prisma.workspace.create({
          data: {
            name: 'My workspace',
            description: `workspace created for ${newUser.name}`,
            inviteCode: generateInviteCode,
            owner: {
              connect: {
                id: newUser.id,
              },
            },
          },
        });

        
        // find role of the user
        let roleMember = await prisma.userRole.findFirst({
          where: {
            role: {  has: Role.OWNER},
          },
        });

        if (!roleMember) {
          roleMember = await prisma.userRole.create({
            data: {
              role: [Role.OWNER],
              permission: ownerDefaultPermissions,
            },
          });
        }

        // create a new membership for the user
        const member = await prisma.member.create({
          data: {
            workspaceId: workspace.id,
            userId: newUser.id,
            role: {
              connect: {
                id: roleMember.id,
              },
            },
          },
        });

        //update the current user
          const currentWorkspace = await prisma.user.update({
            where: {
              id: newUser.id,
            },
            data: {
              currentWorkspaceId: workspace.id,
            },
          });
        return { message: 'user successfully registered', workspace, member };
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException(
          error.message || 'something went wrong',
        );
      }
    });

    return transaction;
  }

  // login
  async login(loginAuthDto: LoginAuthDto) {
    try {
      const { email, password, inviteCode } = loginAuthDto;
      console.log('Login request received for:', email);
      // find if user exist

      const existingUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
        include:{
           members: {
          include: {
            role: true,
            workspace: true,
          },
        },
          projects:true,
          
        }
      });
      if (!existingUser) {
        throw new NotFoundException('user not found');
      }

      // verify the password
      const isMatch = await argon2.verify(existingUser.password, password);
      if (!isMatch) throw new UnauthorizedException('invalid credentials');

      const token = await this.generateJwt(existingUser);
      
      return {
        message: 'user logged in',
        user: existingUser,
        token: token,
      };
    } catch (error) {
      
      throw new InternalServerErrorException(error ||'something went wrong');
    }
  }

  findOne() {
    try {
      return `This action returns a  auth`;
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
    
  }


  //  validate user if user is already in our database
  async validateGoogleUser(googleUser: CreateAuthDto) {
    const transaction = await this.prisma.$transaction(async (prisma) => {
      try {
        if (!googleUser.email || !googleUser.name) {
          throw new BadRequestException(
            'Google user must have an email and name',
          );
        }
        const user = await prisma.user.findUnique({
          where: {
            email: googleUser.email,
          },
        });
        if (user) return user;
        const newUser = await prisma.user.create({
          data: {
            email: googleUser.email,
            name: googleUser.name,
            password: '',
          },
        });
        console.log('New User:', newUser);

        // create new workspcae
        const inviteCode = await this.workspaceService.generateInviteCode();
        const workspace = await prisma.workspace.create({
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

        // find role of the user
        let roleMember = await prisma.userRole.findFirst({
          where: {
            role: { equals: [Role.OWNER] },
          },
        });

        if (!roleMember) {
          roleMember = await prisma.userRole.create({
            data: {
              role: [Role.OWNER],

              permission: ownerDefaultPermissions,
            },
          });
        }

        // create a new membership for the user
        const member = await prisma.member.create({
          data: {
            workspaceId: workspace.id,
            userId: newUser.id,
            role: {
              connect: {
                id: roleMember.id,
              },
            },
          },
        });

        //update the current user
        const currentWorkspace = await prisma.user.update({
          where: {
            id: newUser.id,
          },
          data: {
            currentWorkspaceId: workspace.id,
          },
        });
        return { message: 'user logged in', workspace, member };
      } catch (error) {
        console.error('Workspace/Member Creation Error:', error);
        throw new InternalServerErrorException(
          'Failed to create workspace or member',
        );
      }
    });
    return transaction;
  }

  async generateJwt(existingUser) {

    // Filter to get the member info for the current workspace
    const currentWorkspaceMember =existingUser.members.find((member)=>member.workspaceId === existingUser.currentWorkspaceId)
    console.log(currentWorkspaceMember)
    if (!currentWorkspaceMember) {
      throw new BadRequestException(
        'User is not part of the current workspace',
      );
    }
   const roles =currentWorkspaceMember.role.flatMap((role)=>role.role) ||[]
  const permissions = currentWorkspaceMember.role.flatMap((permission)=>permission.permission);
      const payload = {
        sub: existingUser.id,
        roles: roles,
        rolePermissions: permissions,
      };
     console.log('roles', payload);
    return this.jwt.signAsync(payload);
  }



  
  async findallUser() {
    const users = await this.prisma.user.findMany({
      include: {
        members:{
          select:{
            role:true
          }
        },
        workspaces: true,

      },
    });
    return users;
  }
}
