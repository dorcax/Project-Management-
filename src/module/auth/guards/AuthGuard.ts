import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PrismaService } from 'src/prisma.services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.extractFromHeader(request);
      if (!token) {
        throw new UnauthorizedException('invalid token');
      }
      // verify the password
      const decoded = await this.jwt.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      if (!decoded) {
        throw new UnauthorizedException('invalid credentials');
      }
      // find user
      const user = await this.prisma.user.findUnique({
        where: {
          id: decoded.sub,
        },
      });
      if (!user) {
        throw new NotFoundException('user not found');
      }
      request.user = decoded;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('somwthing went wrong');
    }
    return true;
  }

  private extractFromHeader(request: Request) {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
      return authHeader.split(' ')[1];
    }
  }
}
