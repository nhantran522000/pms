import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@pms/data-access';
import { TaskRepository } from './infrastructure/repositories/task.repository';
import { TaskService } from './application/services/task.service';
import { TaskController } from './presentation/controllers/task.controller';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
  exports: [TaskService],
})
export class TasksModule {}
