import { Injectable } from '@nestjs/common';
import { PrismaService } from '@pms/data-access';
import { TaskEntity } from '../../domain/entities/task.entity';
import { Prisma } from '@prisma/client';
import type { TaskWithSubtasks } from '@pms/shared-types';

export interface CreateTaskInput {
  tenantId: string;
  parentId?: string | null;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  priority?: number;
  tags?: string[];
}

@Injectable()
export class TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateTaskInput): Promise<TaskEntity> {
    const task = await this.prisma.task.create({
      data: {
        tenantId: input.tenantId,
        parentId: input.parentId ?? null,
        title: input.title,
        description: input.description ?? null,
        dueDate: input.dueDate ?? null,
        priority: input.priority ?? 2,
        tags: input.tags ?? [],
        isCompleted: false,
        isDeleted: false,
      },
    });
    return TaskEntity.fromPrisma(task);
  }

  async findById(id: string, tenantId: string): Promise<TaskEntity | null> {
    const task = await this.prisma.task.findFirst({
      where: { id, tenantId, isDeleted: false },
    });
    return task ? TaskEntity.fromPrisma(task) : null;
  }

  async findAll(tenantId: string, options?: {
    status?: 'pending' | 'completed' | 'overdue';
    priority?: number;
    tags?: string[];
    parentId?: string | null; // null for root tasks, string for subtasks
    hasDueDate?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<TaskEntity[]> {
    const where: Prisma.TaskWhereInput = {
      tenantId,
      isDeleted: false,
      ...(options?.parentId !== undefined && { parentId: options.parentId }),
      ...(options?.priority && { priority: options.priority }),
      ...(options?.tags && options.tags.length > 0 && {
        tags: { hasSome: options.tags }
      }),
      ...(options?.hasDueDate !== undefined && {
        dueDate: options.hasDueDate ? { not: null } : null
      }),
    };

    // Handle status filtering
    if (options?.status) {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (options.status === 'completed') {
        where.isCompleted = true;
      } else if (options.status === 'overdue') {
        where.isCompleted = false;
        where.dueDate = { lt: startOfToday };
      } else if (options.status === 'pending') {
        where.isCompleted = false;
        where.OR = [
          { dueDate: null },
          { dueDate: { gte: startOfToday } }
        ];
      }
    }

    const tasks = await this.prisma.task.findMany({
      where,
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' },
        { createdAt: 'desc' },
      ],
      take: options?.limit ?? 50,
      skip: options?.offset ?? 0,
    });

    return tasks.map(TaskEntity.fromPrisma);
  }

  async findWithSubtasks(id: string, tenantId: string): Promise<TaskWithSubtasks | null> {
    const task = await this.prisma.task.findFirst({
      where: { id, tenantId, isDeleted: false },
      include: {
        children: {
          where: { isDeleted: false },
          orderBy: { priority: 'desc' },
        },
      },
    });

    if (!task) return null;

    const entity = TaskEntity.fromPrisma(task);
    return {
      ...entity.toJSON(),
      subtasks: task.children.map(c => ({
        ...TaskEntity.fromPrisma(c).toJSON(),
        subtasks: [],
      })),
    };
  }

  async update(id: string, tenantId: string, input: Partial<CreateTaskInput>): Promise<TaskEntity> {
    const data: Prisma.TaskUpdateInput = {};

    if (input.title !== undefined) data.title = input.title;
    if (input.description !== undefined) data.description = input.description;
    if (input.dueDate !== undefined) data.dueDate = input.dueDate;
    if (input.priority !== undefined) data.priority = input.priority;
    if (input.tags !== undefined) data.tags = input.tags;

    const task = await this.prisma.task.update({
      where: { id },
      data,
    });

    return TaskEntity.fromPrisma(task);
  }

  async markComplete(id: string, tenantId: string, completed: boolean): Promise<TaskEntity> {
    const task = await this.prisma.task.update({
      where: { id },
      data: {
        isCompleted: completed,
        completedAt: completed ? new Date() : null,
      },
    });

    return TaskEntity.fromPrisma(task);
  }

  async softDelete(id: string, tenantId: string): Promise<TaskEntity> {
    const task = await this.prisma.task.update({
      where: { id },
      data: { isDeleted: true },
    });

    return TaskEntity.fromPrisma(task);
  }

  async count(tenantId: string, options?: {
    status?: 'pending' | 'completed' | 'overdue';
  }): Promise<number> {
    const where: Prisma.TaskWhereInput = {
      tenantId,
      isDeleted: false,
    };

    if (options?.status) {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (options.status === 'completed') {
        where.isCompleted = true;
      } else if (options.status === 'overdue') {
        where.isCompleted = false;
        where.dueDate = { lt: startOfToday };
      } else if (options.status === 'pending') {
        where.isCompleted = false;
        where.OR = [
          { dueDate: null },
          { dueDate: { gte: startOfToday } }
        ];
      }
    }

    return this.prisma.task.count({ where });
  }
}
