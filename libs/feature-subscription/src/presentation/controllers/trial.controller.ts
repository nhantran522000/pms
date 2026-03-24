import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '@pms/feature-auth';
import { TrialService } from '../../application/services/trial.service';

@Controller('subscription')
@UseGuards(JwtAuthGuard)
export class TrialController {
  constructor(private readonly trialService: TrialService) {}

  @Get('trial-status')
  async getTrialStatus(@Request() req: any) {
    const tenantId = req.user.tenantId;
    return this.trialService.getTrialStatus(tenantId);
  }

  @Get('status')
  async getSubscriptionStatus(@Request() req: any) {
    const tenantId = req.user.tenantId;
    return this.trialService.getSubscriptionStatus(tenantId);
  }
}
