import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@pms/data-access';
import { HabitController } from './presentation/controllers/habit.controller';
import { HabitService } from './application/services/habit.service';
import { HabitCompletionService } from './application/services/habit-completion.service';
import { HabitScheduleService } from './application/services/habit-schedule.service';
import { HabitRepository } from './infrastructure/repositories/habit.repository';
import { HabitCompletionRepository } from './infrastructure/repositories/habit-completion.repository';
import { CronParserService } from './infrastructure/services/cron-parser.service';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [HabitController],
  providers: [
    HabitService,
    HabitCompletionService,
    HabitScheduleService,
    HabitRepository,
    HabitCompletionRepository,
    CronParserService,
  ],
  exports: [HabitService, HabitCompletionService, HabitScheduleService],
})
export class HabitsModule {}
