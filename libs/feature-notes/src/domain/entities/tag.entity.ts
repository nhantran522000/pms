import { Tag } from '@prisma/client';

export class TagEntity {
  private constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly createdAt: Date,
  ) {}

  static fromPrisma(tag: Tag): TagEntity {
    return new TagEntity(
      tag.id,
      tag.tenantId,
      tag.name,
      tag.createdAt,
    );
  }

  toJSON() {
    return {
      id: this.id,
      tenantId: this.tenantId,
      name: this.name,
      createdAt: this.createdAt,
    };
  }
}
