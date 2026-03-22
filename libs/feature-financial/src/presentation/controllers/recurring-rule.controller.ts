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
import { RecurringTransactionService } from '../../application/services/recurring-transaction.service';
import { ZodValidationPipe } from '@pms/shared-kernel';
import {
  CreateRecurringRuleSchema,
  CreateRecurringRuleDto,
  UpdateRecurringRuleSchema,
  UpdateRecurringRuleDto,
} from '@pms/shared-types';
import { z } from 'zod';

const ListQuerySchema = z.object({
  includeInactive: z.coerce.boolean().default(false),
});

@Controller('recurring-rules')
export class RecurringRuleController {
  constructor(
    private readonly recurringTransactionService: RecurringTransactionService,
  ) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateRecurringRuleSchema)) dto: CreateRecurringRuleDto,
  ) {
    const rule = await this.recurringTransactionService.create(dto);
    return {
      success: true,
      data: rule.toJSON(),
    };
  }

  @Get()
  async findAll(@Query() query: z.infer<typeof ListQuerySchema>) {
    const rules = await this.recurringTransactionService.findAll(query.includeInactive);
    return {
      success: true,
      data: rules.map((r) => r.toJSON()),
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const rule = await this.recurringTransactionService.findById(id);
    return {
      success: true,
      data: rule.toJSON(),
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateRecurringRuleSchema)) dto: UpdateRecurringRuleDto,
  ) {
    const rule = await this.recurringTransactionService.update(id, dto);
    return {
      success: true,
      data: rule.toJSON(),
    };
  }

  @Put(':id/deactivate')
  async deactivate(@Param('id') id: string) {
    const rule = await this.recurringTransactionService.deactivate(id);
    return {
      success: true,
      data: rule.toJSON(),
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.recurringTransactionService.delete(id);
    return {
      success: true,
      data: { message: 'Recurring rule deleted successfully' },
    };
  }
}
