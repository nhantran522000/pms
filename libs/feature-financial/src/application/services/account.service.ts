import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { AccountRepository } from '../../infrastructure/repositories/account.repository';
import { AccountEntity } from '../../domain/entities/account.entity';
import { Money } from '../../domain/value-objects/money.vo';
import { CreateAccountDto, UpdateAccountDto, AccountSummary } from '@pms/shared-types';
import { getTenantId } from '@pms/data-access';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(private readonly accountRepository: AccountRepository) {}

  async create(dto: CreateAccountDto): Promise<AccountEntity> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    this.logger.log(`Creating account: ${dto.name}`);

    // Check for duplicate name
    const existing = await this.accountRepository.findByName(dto.name, tenantId);
    if (existing) {
      throw new Error(`Account with name "${dto.name}" already exists`);
    }

    const initialBalance = Money.fromDecimal(dto.initialBalance);

    return this.accountRepository.create({
      ...dto,
      tenantId,
      initialBalance,
    });
  }

  async findById(id: string): Promise<AccountEntity> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    const account = await this.accountRepository.findById(id, tenantId);

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async findAll(includeArchived = false): Promise<AccountEntity[]> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    return this.accountRepository.findAll(tenantId, includeArchived);
  }

  async findByType(type: 'checking' | 'savings' | 'cash' | 'credit'): Promise<AccountEntity[]> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    return this.accountRepository.findByType(tenantId, type);
  }

  async getSummaries(includeArchived = false): Promise<AccountSummary[]> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    const accounts = await this.accountRepository.findAll(tenantId, includeArchived);

    const summaries: AccountSummary[] = await Promise.all(
      accounts.map(async (account) => {
        const transactionCount = await this.accountRepository.countTransactions(
          account.id,
          tenantId,
        );

        return {
          ...account.toJSON(),
          balanceChange: account.getBalanceChange().toString(),
          transactionCount,
        };
      }),
    );

    return summaries;
  }

  async update(id: string, dto: UpdateAccountDto): Promise<AccountEntity> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

    // Verify account exists
    const existing = await this.accountRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException('Account not found');
    }

    // Check for duplicate name if changing
    if (dto.name && dto.name !== existing.name) {
      const duplicate = await this.accountRepository.findByName(dto.name, tenantId);
      if (duplicate) {
        throw new Error(`Account with name "${dto.name}" already exists`);
      }
    }

    this.logger.log(`Updating account: ${id}`);
    return this.accountRepository.update(id, tenantId, dto);
  }

  async archive(id: string): Promise<AccountEntity> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

    const existing = await this.accountRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException('Account not found');
    }

    this.logger.log(`Archiving account: ${id}`);
    return this.accountRepository.archive(id, tenantId);
  }

  async unarchive(id: string): Promise<AccountEntity> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

    const existing = await this.accountRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException('Account not found');
    }

    this.logger.log(`Unarchiving account: ${id}`);
    return this.accountRepository.unarchive(id, tenantId);
  }

  async getTotalBalance(): Promise<{ balance: string }> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    const total = await this.accountRepository.getTotalBalance(tenantId);
    return { balance: total.toString() };
  }

  async recalculateBalance(id: string): Promise<AccountEntity> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

    const existing = await this.accountRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException('Account not found');
    }

    this.logger.log(`Recalculating balance for account: ${id}`);
    return this.accountRepository.recalculateBalance(id, tenantId);
  }
}
