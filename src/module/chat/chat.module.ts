import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { PrismaService } from 'src/prisma.services';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { TokenService } from '../auth/token-verify.service';

@Module({
  imports:[AuthModule,MemberModule],
  providers: [ChatGateway, ChatService,TokenService ,PrismaService],
})
export class ChatModule {}
