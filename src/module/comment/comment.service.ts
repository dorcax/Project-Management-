import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  // import {
  //   ConflictException,
  //   Injectable,
  //   InternalServerErrorException,
  //   NotFoundException,
  //   UnauthorizedException,
  //   BadRequestException,
  // } from '@nestjs/common';
  // import { CreateAuthDto, LoginAuthDto } from './dto/create-auth.dto';
  // import { PrismaService } from 'src/prisma.services';
  // import * as argon2 from 'argon2';
  // import { JwtService } from '@nestjs/jwt';
  // import {
  //   memberDefaultPermission,
  //   ownerDefaultPermissions,
  //   Role,
  // } from './entities/role.entity';
  // import { WorkspaceService } from '../workspace/workspace.service';
  // import { MemberService } from '../member/member.service';
  // import { permission } from 'process';
  // import { Permission } from '@prisma/client';

  // @Injectable()
  // export class AuthService {
  //   constructor(
  //     private readonly prisma: PrismaService,
  //     private readonly jwt: JwtService,
  //     private readonly workspaceService: WorkspaceService,
  //     private readonly memberService: MemberService,
  //   ) {}
  //   async create(createAuthDto: CreateAuthDto) {
  //     try {
  //       const { name, email, password, inviteCode } = createAuthDto;
  //       // find if user already registered
  //       const existingUser = await this.prisma.user.findUnique({
  //         where: {
  //           email,
  //         },
  //       });
  //       if (existingUser) {
  //         throw new ConflictException('email  already exist ');
  //       }

  //       // hash password
  //       const hashedPassword = await argon2.hash(password);

  //       // const userRole = inviteCode ?[Role.MEMBER]:[Role.OWNER]
  //       // const userPermissions =inviteCode?memberDefaultPermission :ownerDefaultPermissions
  //       // create new user
  //       const newUser = await this.prisma.user.create({
  //         data: {
  //           name,
  //           email,
  //           password: hashedPassword
  //         }
  //       });

  //       // if (inviteCode) {
  //       //   await this.memberService.joinAWorkspaceByInvite(inviteCode, newUser.id);
  //       // }

  //       // find role of the user
  //       const role =await this.prisma.userRole.findUnique({
  //         where:{
  //           role:Role.OWNER
  //         }
  //       })
  //       // create new workspace
  //       const generateInviteCode =
  //         await this.workspaceService.generateInviteCode();
  //       const workspace = await this.prisma.workspace.create({
  //         data: {
  //           name: 'My workspace',
  //           description: `workspace created for ${newUser.name}`,
  //           inviteCode: generateInviteCode,
  //           owner: {
  //             connect: {
  //               id: newUser.id,
  //             },
  //           },
  //         },
  //       });

  //       // create a new membership for the user
  //       const member = await this.prisma.member.create({
  //         data: {
  //           workspaceId: workspace.id,
  //           userId: newUser.id,
  //           role: [Role.OWNER],
  //         },
  //       });
  //       // if there is no inviteCode
  //       if (!inviteCode) {
  //         const currentWorkspace = await this.prisma.user.update({
  //           where: {
  //             id: newUser.id,
  //           },
  //           data: {
  //             currentWorkspaceId: workspace.id,
  //           },
  //         });
  //       }
  //       return { message: 'user successfully registered', workspace, member };
  //     } catch (error) {
  //       console.log(error);
  //       throw new InternalServerErrorException(
  //         error.message || 'something went wrong',
  //       );
  //     }
  //   }

  //   // login
  //   async login(loginAuthDto: LoginAuthDto) {
  //     try {
  //       const { email, password } = loginAuthDto;

  //       // find if user exist

  //       const existingUser = await this.prisma.user.findUnique({
  //         where: {
  //           email,
  //         },
  //         include: {
  //           roles: true,
  //         },
  //       });
  //       if (!existingUser) {
  //         throw new NotFoundException('user not found');
  //       }

  //       // verify thhe password
  //       const isMatch = await argon2.verify(existingUser.password, password);
  //       if (!isMatch) throw new UnauthorizedException('invalid credentials');
  //       const token = await this.generateJwt(existingUser);
  //       return {
  //         user: existingUser,
  //         token: token,
  //       };
  //     } catch (error) {
  //       console.log(error);
  //       throw new InternalServerErrorException('something went wrong');
  //     }
  //   }

  //   findOne() {
  //     return `This action returns a  auth`;
  //   }

  //   //  validate user if user is already in our database
  //   async validateGoogleUser(googleUser: CreateAuthDto) {
  //     try {
  //       if (!googleUser.email || !googleUser.name) {
  //         throw new BadRequestException(
  //           'Google user must have an email and name',
  //         );
  //       }
  //       const user = await this.prisma.user.findUnique({
  //         where: {
  //           email: googleUser.email,
  //         },
  //         include: { roles: true },
  //       });
  //       if (user) return user;
  //       const newUser = await this.prisma.user.create({
  //         data: {
  //           email: googleUser.email,
  //           name: googleUser.name,
  //           password: '',
  //           roles: {
  //             create: {
  //               role: [Role.OWNER],
  //               permission: ownerDefaultPermissions,
  //             },
  //           },
  //         },
  //         include: {
  //           roles: true,
  //         },
  //       });
  //       console.log('New User:', newUser);

  //       // create new workspcae
  //       const inviteCode = await this.workspaceService.generateInviteCode();
  //       const workspace = await this.prisma.workspace.create({
  //         data: {
  //           name: 'My workspace',
  //           description: `workspace created for ${newUser.name}`,
  //           inviteCode: inviteCode,
  //           owner: {
  //             connect: {
  //               id: newUser.id,
  //             },
  //           },
  //         },
  //       });

  //       // create a new membership for the user
  //       const userRole =
  //         newUser.roles.length > 0 ? newUser.roles[0].role : undefined;
  //       const member = await this.prisma.member.create({
  //         data: {
  //           workspaceId: workspace.id,
  //           userId: newUser.id,
  //           role: userRole,
  //         },
  //       });
  //       console.log('workspace', workspace);
  //       console.log('member', member);
  //       return { message: 'user logged in', workspace, member };
  //     } catch (error) {
  //       console.error('Workspace/Member Creation Error:', error);
  //       throw new InternalServerErrorException(
  //         'Failed to create workspace or member',
  //       );
  //     }
  //   }

  //   async generateJwt(existingUser: any) {
  //     // Extract roles and permissions
  //     // console.log('User object in generateJwt:', existingUser);
  //     const roles = existingUser.roles.map((role) => role.role);

  //     const permissions = existingUser.roles.flatMap((role) => role.permission);
  //     // console.log('permissions', permissions);
  //     const payload = {
  //       sub: existingUser.id,
  //       email: existingUser.email,
  //       roles: roles,
  //       permissions,
  //     };
  //     //  console.log('roles', payload);
  //     return this.jwt.signAsync(payload);
  //   }

  //   async findallUser() {
  //     const users = await this.prisma.user.findMany({
  //       include: {
  //         members: true,
  //         workspaces: true,
  //         roles: true,
  //       },
  //     });
  //     return users;
  //   }
  // }
  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
  //     context.getClass(),
  //     context.getHandler(),
  //   ]);

  //   const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(
  //     PERMISSIONS_KEY,
  //     [context.getClass(), context.getHandler()],
  //   );
  //   // if no role or permission are required ,allow access
  //   if (!requiredRoles && !requiredPermissions) {
  //     return true;
  //   }

  //   //  get user
  //   const { user } = context.switchToHttp().getRequest();

  //   console.log('User Data:', user);
  //   console.log('Required Roles:', requiredRoles);
  //   console.log('Required Permissions:', requiredPermissions);
  //   // check if role is allowed
  //   if (
  //     requiredRoles &&
  //     !requiredRoles.some((role) => user.roles?.includes(role))
  //   ) {
  //     console.log(user.roles);
  //     throw new ForbiddenException('Access Denied: Insufficient role');
  //   }

  //   // check if permission is given
  //   if (
  //     requiredPermissions &&
  //     !requiredPermissions.some((permission) =>
  //       user.permissions?.includes(permission.trim()),
  //     )
  //   ) {
  //     throw new ForbiddenException('Access Denied: Insufficient permission');
  //   }
  //   return true;
  // }
  create(createCommentDto: CreateCommentDto) {
    return 'This action adds a new comment';
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
