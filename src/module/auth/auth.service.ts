import { ConflictException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma.services';

@Injectable()
export class AuthService {
  constructor(private readonly prisma:PrismaService){}
  async create(createAuthDto: CreateAuthDto) {
   try {
    const{name ,email,password} =createAuthDto
    // find if user already registered  
    const user =await this.prisma.user.findUnique({
      where:{
        email
      }
    })
    if(user){
      throw new ConflictException("user already exist ")
    }

    // create new user
    
   } catch (error) {
    
   }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
