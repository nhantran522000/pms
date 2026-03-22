import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { TaskRepository, CreateTaskInput } from '../../infrastructure/repositories/task.repository';
import { TaskEntity } from '../../domain/entities/task.entity';
import { CreateTaskDto, UpdateTaskDto, TaskWithSubtasks } from '@pms/shared-types';
import { getTenantId } from '@pms/data-access';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private readonly taskRepository: TaskRepository) {}

  async create(dto: CreateTaskDto): Promise<TaskEntity> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

    // Validate parent exists if parentId provided
    if (dto.parentId) {
      const parent = await this.taskRepository.findById(dto.parentId, tenantId);
      if (!parent) {
        throw new BadRequestException('Parent task not found');
      }
      // Prevent nested subtasks beyond 2 levels (optional design decision)
      if (parent.isSubtask()) {
        throw new BadRequestException('Cannot create subtask of a subtask');
      }
    }

    const input: CreateTaskInput = {
      tenantId,
      parentId: dto.parentId ?? null,
      title: dto.title,
      description: dto.description ?? null,
      dueDate: dto.dueDate ? this.parseDate(dto.dueDate) : null,
      priority: dto.priority ?? 2,
      tags: dto.tags ?? [],
    };

    const task = await this.taskRepository.create(input);
    this.logger.log(`Task created: ${task.id}`);

    return task;
  }

  async findById(id: string): Promise<TaskWithSubtasks> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

    const task = await this.taskRepository.findWithSubtasks(id, tenantId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async findAll(options?: {
    status?: 'pending' | 'completed' | 'overdue';
    priority?: number;
    tags?: string[];
    rootOnly?: boolean;
    sortBy?: 'dueDate' | 'priority' | 'createdAt' | 'title';
    sortOrder?: 'asc' | 'desc';
  }): Promise<TaskEntity[]> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

    return this.taskRepository.findAll(tenantId, {
      ...options,
      parentId: options?.rootOnly ? null : undefined,
    });
  }

  async update(id: string, dto: UpdateTaskDto): Promise<TaskEntity> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

    const existing = await this.taskRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException('Task not found');
    }

    const input: Partial<CreateTaskInput> = {
      title: dto.title,
      description: dto.description ?? null,
      dueDate: dto.dueDate !== undefined
        ? (dto.dueDate ? this.parseDate(dto.dueDate) : null)
        : undefined,
      priority: dto.priority,
      tags: dto.tags,
    };

    const task = await this.taskRepository.update(id, tenantId, input);
    this.logger.log(`Task updated: ${id}`);

    return task;
  }

  async markComplete(id: string, completed: boolean): Promise<TaskEntity> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

    const existing = await this.taskRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException('Task not found');
    }

    const task = await this.taskRepository.markComplete(id, tenantId, completed);
    this.logger.log(`Task ${completed ? 'completed' : 'reopened'}: ${id}`);

    return task;
  }

  async delete(id: string): Promise<void> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

    const existing = await this.taskRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException('Task not found');
    }

    await this.taskRepository.softDelete(id, tenantId);
    this.logger.log(`Task deleted: ${id}`);
  }

  async count(options?: { status?: 'pending' | 'completed' | 'overdue' }): Promise<number> {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }

    return this.taskRepository.count(tenantId, options);
  }

  private parseDate(date: string | Date): Date {
    return typeof date === 'string' ? new Date(date) : date;
  }
}
