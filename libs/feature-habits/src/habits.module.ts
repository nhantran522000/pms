import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@pms/data-access';
import { HabitController } from './presentation/controllers/habit.controller';
import { HabitService } from './application/services/habit.service';
import { HabitCompletionService } from './application/services/habit-completion.service';
import { HabitRepository } from './infrastructure/repositories/habit.repository';
import { HabitCompletionRepository } from './infrastructure/repositories/habit-completion.repository';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [HabitController],
  providers: [
    HabitService,
    HabitCompletionService,
    HabitRepository,
    HabitCompletionRepository,
  ],
  exports: [HabitService, HabitCompletionService],
})
export class HabitsModule {}
