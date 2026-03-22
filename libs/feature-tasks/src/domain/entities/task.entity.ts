import { Task } from '@prisma/client';

export class TaskEntity {
  private constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly parentId: string | null,
    public readonly title: string,
    public readonly description: string | null,
    public readonly dueDate: Date | null,
    public readonly priority: number,
    public readonly tags: string[],
    public readonly isCompleted: boolean,
    public readonly completedAt: Date | null,
    public readonly isDeleted: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromPrisma(task: Task): TaskEntity {
    return new TaskEntity(
      task.id,
      task.tenantId,
      task.parentId,
      task.title,
      task.description,
      task.dueDate,
      task.priority,
      task.tags,
      task.isCompleted,
      task.completedAt,
      task.isDeleted,
      task.createdAt,
      task.updatedAt,
    );
  }

  /**
   * Check if task is overdue
   * Overdue when: dueDate < start of today AND not completed AND not deleted
   */
  isOverdue(): boolean {
    if (!this.dueDate || this.isCompleted || this.isDeleted) {
      return false;
    }
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return this.dueDate < startOfToday;
  }

  /**
   * Get task status
   */
  getStatus(): 'pending' | 'completed' | 'overdue' {
    if (this.isCompleted) return 'completed';
    if (this.isOverdue()) return 'overdue';
    return 'pending';
  }

  /**
   * Check if this is a subtask
   */
  isSubtask(): boolean {
    return this.parentId !== null;
  }

  /**
   * Get priority label
   */
  getPriorityLabel(): string {
    const labels: Record<number, string> = {
      1: 'Low',
      2: 'Medium',
      3: 'High',
      4: 'Urgent',
    };
    return labels[this.priority] || 'Medium';
  }

  toJSON() {
    return {
      id: this.id,
      tenantId: this.tenantId,
      parentId: this.parentId,
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      priority: this.priority,
      priorityLabel: this.getPriorityLabel(),
      tags: this.tags,
      isCompleted: this.isCompleted,
      completedAt: this.completedAt,
      isOverdue: this.isOverdue(),
      status: this.getStatus(),
      isDeleted: this.isDeleted,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
