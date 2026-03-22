import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { AccountService } from '../../application/services/account.service';
import { ZodValidationPipe } from '@pms/shared-kernel';
import {
  CreateAccountSchema,
  CreateAccountDto,
  UpdateAccountSchema,
  UpdateAccountDto,
} from '@pms/shared-types';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateAccountSchema)) dto: CreateAccountDto,
  ) {
    const account = await this.accountService.create(dto);
    return {
      success: true,
      data: account.toJSON(),
    };
  }

  @Get()
  async findAll(@Query('includeArchived') includeArchived?: string) {
    const accounts = await this.accountService.findAll(includeArchived === 'true');
    return {
      success: true,
      data: accounts.map((a) => a.toJSON()),
    };
  }

  @Get('summaries')
  async getSummaries(@Query('includeArchived') includeArchived?: string) {
    const summaries = await this.accountService.getSummaries(includeArchived === 'true');
    return {
      success: true,
      data: summaries,
    };
  }

  @Get('total-balance')
  async getTotalBalance() {
    const result = await this.accountService.getTotalBalance();
    return {
      success: true,
      data: result,
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const account = await this.accountService.findById(id);
    return {
      success: true,
      data: account.toJSON(),
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateAccountSchema)) dto: UpdateAccountDto,
  ) {
    const account = await this.accountService.update(id, dto);
    return {
      success: true,
      data: account.toJSON(),
    };
  }

  @Put(':id/archive')
  async archive(@Param('id') id: string) {
    const account = await this.accountService.archive(id);
    return {
      success: true,
      data: account.toJSON(),
    };
  }

  @Put(':id/unarchive')
  async unarchive(@Param('id') id: string) {
    const account = await this.accountService.unarchive(id);
    return {
      success: true,
      data: account.toJSON(),
    };
  }

  @Post(':id/recalculate-balance')
  async recalculateBalance(@Param('id') id: string) {
    const account = await this.accountService.recalculateBalance(id);
    return {
      success: true,
      data: account.toJSON(),
    };
  }
}
