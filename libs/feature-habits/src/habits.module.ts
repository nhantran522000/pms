import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@pms/data-access';
import { HabitController } from './presentation/controllers/habit.controller';
import { GamificationController } from './presentation/controllers/gamification.controller';
import { HabitService } from './application/services/habit.service';
import { HabitCompletionService } from './application/services/habit-completion.service';
import { HabitScheduleService } from './application/services/habit-schedule.service';
import { GamificationService } from './application/services/gamification.service';
import { UserStatsService } from './application/services/user-stats.service';
import { HabitCalendarService } from './application/services/habit-calendar.service';
import { HabitRepository } from './infrastructure/repositories/habit.repository';
import { HabitCompletionRepository } from './infrastructure/repositories/habit-completion.repository';
import { UserStatsRepository } from './infrastructure/repositories/user-stats.repository';
import { AchievementRepository } from './infrastructure/repositories/achievement.repository';
import { CronParserService } from './infrastructure/services/cron-parser.service';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [HabitController, GamificationController],
  providers: [
    HabitService,
    HabitCompletionService,
    HabitScheduleService,
    GamificationService,
    UserStatsService,
    HabitCalendarService,
    HabitRepository,
    HabitCompletionRepository,
    UserStatsRepository,
    AchievementRepository,
    CronParserService,
  ],
  exports: [
    HabitService,
    HabitCompletionService,
    HabitScheduleService,
    GamificationService,
    UserStatsService,
    HabitCalendarService,
  ],
})
export class HabitsModule {}
