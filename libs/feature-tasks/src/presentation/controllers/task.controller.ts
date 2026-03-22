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
import { TaskService } from '../../application/services/task.service';
import { ZodValidationPipe } from '@pms/shared-kernel';
import {
  CreateTaskSchema,
  CreateTaskDto,
  UpdateTaskSchema,
  UpdateTaskDto,
} from '@pms/shared-types';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateTaskSchema)) dto: CreateTaskDto,
  ) {
    const task = await this.taskService.create(dto);
    return { success: true, data: task.toJSON() };
  }

  @Get()
  async findAll(@Query() query: {
    status?: 'pending' | 'completed' | 'overdue';
    priority?: string;
    tags?: string;
    rootOnly?: string;
  }) {
    const tasks = await this.taskService.findAll({
      status: query.status,
      priority: query.priority ? parseInt(query.priority, 10) : undefined,
      tags: query.tags?.split(',').filter(Boolean),
      rootOnly: query.rootOnly === 'true',
    });
    return { success: true, data: tasks.map(t => t.toJSON()) };
  }

  @Get('count')
  async count(@Query() query: { status?: 'pending' | 'completed' | 'overdue' }) {
    const count = await this.taskService.count({ status: query.status });
    return { success: true, data: { count } };
  }

  @Get('overdue')
  async getOverdue() {
    const tasks = await this.taskService.findAll({ status: 'overdue' });
    return { success: true, data: tasks.map(t => t.toJSON()) };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const task = await this.taskService.findById(id);
    return { success: true, data: task };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateTaskSchema)) dto: UpdateTaskDto,
  ) {
    const task = await this.taskService.update(id, dto);
    return { success: true, data: task.toJSON() };
  }

  @Post(':id/complete')
  async markComplete(
    @Param('id') id: string,
    @Body() body: { completed?: boolean },
  ) {
    const task = await this.taskService.markComplete(id, body.completed ?? true);
    return { success: true, data: task.toJSON() };
  }

  @Post(':id/reopen')
  async reopen(@Param('id') id: string) {
    const task = await this.taskService.markComplete(id, false);
    return { success: true, data: task.toJSON() };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.taskService.delete(id);
    return { success: true, data: { message: 'Task deleted successfully' } };
  }
}
