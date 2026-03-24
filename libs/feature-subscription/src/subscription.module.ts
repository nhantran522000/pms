import { Module } from '@nestjs/common';
import { TrialService } from './application/services/trial.service';
import { TrialController } from './presentation/controllers/trial.controller';
import { PrismaModule } from '@pms/data-access';

@Module({
  imports: [PrismaModule],
  providers: [TrialService],
  exports: [TrialService],
  controllers: [TrialController],
})
export class SubscriptionModule {}
