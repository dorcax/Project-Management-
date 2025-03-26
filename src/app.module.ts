import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { ProfileModule } from './module/profile/profile.module';
import { WorkspaceModule } from './module/workspace/workspace.module';
import { ProjectModule } from './module/project/project.module';
import { TaskModule } from './module/task/task.module';
import { MemberModule } from './module/member/member.module';
import { CommentModule } from './module/comment/comment.module';
import { FileModule } from './module/file/file.module';
import { NotificationModule } from './module/notification/notification.module';
import { SubtaskModule } from './module/subtask/subtask.module';

@Module({
  imports: [AuthModule, ProfileModule, WorkspaceModule, ProjectModule, TaskModule, MemberModule, CommentModule, FileModule, NotificationModule, SubtaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
