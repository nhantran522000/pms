import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { BudgetService } from '../../application/services/budget.service';
import { ZodValidationPipe } from '@pms/shared-kernel';
import {
  AllocateBudgetSchema,
  AllocateBudgetDto,
  UpdateAllocationSchema,
  UpdateAllocationDto,
} from '@pms/shared-types';
import { z } from 'zod';

const MonthQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
  accountId: z.string().cuid().optional(),
});

@Controller('budgets')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post('allocate')
  async allocate(
    @Body(new ZodValidationPipe(AllocateBudgetSchema)) dto: AllocateBudgetDto,
  ) {
    const envelope = await this.budgetService.allocate(dto);
    return {
      success: true,
      data: {
        ...envelope.toJSON(),
        available: envelope.getAvailable().toString(),
        remaining: envelope.getRemaining().toString(),
        isOverBudget: envelope.isOverBudget(),
      },
    };
  }

  @Get('monthly')
  async getMonthSummary(@Query() query: z.infer<typeof MonthQuerySchema>) {
    const summary = await this.budgetService.getMonthSummary(query.month, query.accountId);
    return {
      success: true,
      data: summary,
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const envelope = await this.budgetService.findById(id);
    return {
      success: true,
      data: {
        ...envelope.toJSON(),
        available: envelope.getAvailable().toString(),
        remaining: envelope.getRemaining().toString(),
        isOverBudget: envelope.isOverBudget(),
      },
    };
  }

  @Put(':id')
  async updateAllocation(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateAllocationSchema)) dto: UpdateAllocationDto,
  ) {
    const envelope = await this.budgetService.updateAllocation(id, dto);
    return {
      success: true,
      data: {
        ...envelope.toJSON(),
        available: envelope.getAvailable().toString(),
        remaining: envelope.getRemaining().toString(),
        isOverBudget: envelope.isOverBudget(),
      },
    };
  }

  @Delete(':id')
  async deleteAllocation(@Param('id') id: string) {
    await this.budgetService.deleteAllocation(id);
    return {
      success: true,
      data: { message: 'Budget allocation deleted successfully' },
    };
  }
}
