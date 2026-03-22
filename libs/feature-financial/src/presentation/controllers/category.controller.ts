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
import { CategoryService } from '../../application/services/category.service';
import { ZodValidationPipe } from '@pms/shared-kernel';
import {
  CreateCategorySchema,
  CreateCategoryDto,
  UpdateCategorySchema,
  UpdateCategoryDto,
  CategoryTypeSchema,
} from '@pms/shared-types';
import { z } from 'zod';

const IdParamSchema = z.object({ id: z.string().cuid() });
const TypeQuerySchema = z.object({ type: CategoryTypeSchema.optional() });

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateCategorySchema)) dto: CreateCategoryDto,
  ) {
    const category = await this.categoryService.create(dto);
    return {
      success: true,
      data: category.toJSON(),
    };
  }

  @Get()
  async findAll(@Query('type') type?: 'income' | 'expense') {
    const categories = type
      ? await this.categoryService.findByType(type)
      : await this.categoryService.findAll();

    return {
      success: true,
      data: categories.map((c) => c.toJSON()),
    };
  }

  @Get('tree')
  async getTree() {
    const tree = await this.categoryService.getTree();
    return {
      success: true,
      data: tree,
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const category = await this.categoryService.findById(id);
    return {
      success: true,
      data: category.toJSON(),
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateCategorySchema)) dto: UpdateCategoryDto,
  ) {
    const category = await this.categoryService.update(id, dto);
    return {
      success: true,
      data: category.toJSON(),
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.categoryService.delete(id);
    return {
      success: true,
      data: { message: 'Category deleted successfully' },
    };
  }
}
