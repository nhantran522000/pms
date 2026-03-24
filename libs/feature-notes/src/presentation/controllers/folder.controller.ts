import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { FolderService } from '../../application/services/folder.service';
import { ZodValidationPipe } from '@pms/shared-kernel';
import {
  CreateFolderSchema,
  CreateFolderDto,
  UpdateFolderSchema,
  UpdateFolderDto,
} from '@pms/shared-types';

@Controller('folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateFolderSchema)) dto: CreateFolderDto,
  ) {
    const folder = await this.folderService.create(dto);
    return {
      success: true,
      data: folder.toJSON(),
    };
  }

  @Get()
  async findAll() {
    const folders = await this.folderService.findAll();
    return {
      success: true,
      data: folders.map((f) => f.toJSON()),
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const folder = await this.folderService.findById(id);
    return {
      success: true,
      data: folder.toJSON(),
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateFolderSchema)) dto: UpdateFolderDto,
  ) {
    const folder = await this.folderService.update(id, dto);
    return {
      success: true,
      data: folder.toJSON(),
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.folderService.delete(id);
    return {
      success: true,
      data: { message: 'Folder deleted successfully' },
    };
  }
}
