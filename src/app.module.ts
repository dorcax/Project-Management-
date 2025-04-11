import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { ProfileModule } from './module/profile/profile.module';
import { WorkspaceModule } from './module/workspace/workspace.module';
import { ProjectModule } from './module/project/project.module';
import { TaskModule } from './module/task/task.module';
import { MemberModule } from './module/member/member.module';
import { FileModule } from './module/file/file.module';
import { NotificationModule } from './module/notification/notification.module';
import { ChatModule } from './module/chat/chat.module';
import {createSocketAuthMiddleware} from "./module/chat/middleware/createsocket.io.middleware"


@Module({
  imports: [
    AuthModule,
    ProfileModule,
    WorkspaceModule,
    ProjectModule,
    TaskModule,
    MemberModule,
    FileModule,
    NotificationModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
  
  }
}

