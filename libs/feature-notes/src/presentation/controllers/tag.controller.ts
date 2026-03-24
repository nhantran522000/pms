import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { TagService } from '../../application/services/tag.service';
import { ZodValidationPipe } from '@pms/shared-kernel';
import { CreateTagSchema, CreateTagDto } from '@pms/shared-types';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateTagSchema)) dto: CreateTagDto,
  ) {
    const tag = await this.tagService.create(dto);
    return {
      success: true,
      data: tag.toJSON(),
    };
  }

  @Get()
  async findAll() {
    const tags = await this.tagService.findAll();
    return {
      success: true,
      data: tags.map((t) => t.toJSON()),
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const tag = await this.tagService.findById(id);
    return {
      success: true,
      data: tag.toJSON(),
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.tagService.delete(id);
    return {
      success: true,
      data: { message: 'Tag deleted successfully' },
    };
  }
}
