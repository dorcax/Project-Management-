import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto, LoginAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma.services';
import  * as argon2 from "argon2"
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}
  async create(createAuthDto: CreateAuthDto) {
    try {
      const { name, email, password, role, permission } = createAuthDto;
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
              role: role,
              permission: [permission],
            },
          },
        },
      });
      const { password: _, ...rest } = newUser;
      return { user: rest };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('something went wrong');
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
      const token =await this.generateJwt(existingUser)
      return {
        user: existingUser,
        token: token,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('ssomething went wrong');
    }
  }

  findOne() {
    return `This action returns a  auth`;
  }

  //  validate user if user is already in our database
  async validateGoogleUser(googleUser: CreateAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: googleUser.email,
      },
      include: { roles: true },
    });
    if (user) return user;
    return await this.prisma.user.create({
      data: {
        email: googleUser.email,
        name: googleUser.name,
        password: googleUser.password,
        roles: {
          create: {
            role: googleUser.role,
            permission: [googleUser.permission],
          },
        },
      },
    });
  }

  async generateJwt(existingUser: any) {
    // Extract roles and permissions
     console.log("User object in generateJwt:", existingUser);
    const roles = existingUser.roles.map((role) => role.role);
    console.log('roles', roles);
    const permissions = existingUser.roles.flatMap((role) => role.permission);
    console.log("permissions",permissions)
    const payload = {
      email: existingUser.email,
      name: existingUser.name,
      roles,
      permissions,
    };
    return this.jwt.signAsync(payload); // JWT expires in 2 hours
  }
}