import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto, LoginAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma.services';
import  * as argon2 from "argon2"
import { JwtService } from '@nestjs/jwt';
import { connect } from 'http2';
import { Role } from './entities/role.entity';
import { permission } from 'process';
@Injectable()
export class AuthService {
  constructor(private readonly prisma:PrismaService,
    private readonly jwt:JwtService
  ){}
  async create(createAuthDto: CreateAuthDto) {
   try {
    const{name ,email,password,role,permission} =createAuthDto
    // find if user already registered  
    const existingUser =await this.prisma.user.findUnique({
      where:{
        email
      }
    })
    if(existingUser){
      throw new ConflictException("email  already exist ")
    }

    // hash password
    const hashedPassword =await argon2.hash(password)
    // create new user
    const newUser = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roles: {
          create: {
            role: role,
            permission:  [permission],
          },
        },
      },
    });
    const {password:_, ...rest} =newUser
    return {user:rest}
   } catch (error) {
    console.log(error)
    throw new InternalServerErrorException("something went wrong")
   }
  }



  // login 
  async login(loginAuthDto:LoginAuthDto){
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

      // Extract roles and permissions
      const roles = existingUser.roles.map((role) => role.role);
      console.log("roles",roles)
      const permissions = existingUser.roles.flatMap(
        (role) => role.permission,
      );
      // create a token
      const token = await this.jwt.signAsync({
        sub: existingUser.id,
        email: existingUser.email,
        roles,
        permissions
      });
      return {
        user: existingUser,
        token: token,
      };
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException("ssomething went wrong")
    }

  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne() {
    return `This action returns a  auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
