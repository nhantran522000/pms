import { Module } from '@nestjs/common';
import { PrismaModule } from '@pms/data-access';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class FinancialModule {}
