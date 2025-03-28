import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.services';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import googleOauth from '../config/google-oauth';
import { GoogleStrategy } from './strategy/google-strategy';

@Module({
  imports:[ConfigModule,
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>({
        secret:configService.get<string>("JWT_SECRET"),
        signOptions:{expiresIn:configService.get<string>("JWT_EXPIRES")}
      })
    }),
    ConfigModule.forFeature(googleOauth)
  ],
  controllers: [AuthController],
  providers: [AuthService,PrismaService,GoogleStrategy],
  exports:[AuthService]
})
export class AuthModule {}
