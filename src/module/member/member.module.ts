import { Module,forwardRef } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { PrismaService } from 'src/prisma.services';
import { AuthModule } from '../auth/auth.module';

@Module({
   imports: [forwardRef(() => AuthModule)],
  controllers: [MemberController],
  providers: [MemberService,PrismaService],
  exports:[MemberService]
})
export class MemberModule {}
