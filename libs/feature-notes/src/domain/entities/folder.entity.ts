import { Folder } from '@prisma/client';

export class FolderEntity {
  private constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly noteCount: number = 0,
  ) {}

  static fromPrisma(folder: Folder, noteCount: number = 0): FolderEntity {
    return new FolderEntity(
      folder.id,
      folder.tenantId,
      folder.name,
      folder.createdAt,
      folder.updatedAt,
      noteCount,
    );
  }

  toJSON() {
    return {
      id: this.id,
      tenantId: this.tenantId,
      name: this.name,
      noteCount: this.noteCount,
      createdAt: this.createdAt,
    };
  }
}
