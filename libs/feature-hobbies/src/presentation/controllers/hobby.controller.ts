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
import { HobbyService } from '../../application/services/hobby.service';
import { ZodValidationPipe } from '@pms/shared-kernel';
import {
  CreateHobbySchema,
  UpdateHobbySchema,
  CreateHobbyDto,
  UpdateHobbyDto,
} from '@pms/shared-types';

@Controller('hobbies')
export class HobbyController {
  constructor(private readonly hobbyService: HobbyService) {}

  /**
   * POST /hobbies
   * Create a new hobby
   */
  @Post()
  async create(@Body(new ZodValidationPipe(CreateHobbySchema)) dto: CreateHobbyDto) {
    const hobby = await this.hobbyService.create(dto);
    return {
      success: true,
      data: hobby,
    };
  }

  /**
   * GET /hobbies
   * Get all hobbies
   */
  @Get()
  async findAll(@Query('includeInactive') includeInactive?: string) {
    const includeInactiveBool = includeInactive === 'true';
    const hobbies = await this.hobbyService.findAll(includeInactiveBool);
    return {
      success: true,
      data: hobbies,
    };
  }

  /**
   * GET /hobbies/:id
   * Get a hobby by ID
   */
  @Get(':id')
  async findById(@Param('id') id: string) {
    const hobby = await this.hobbyService.findById(id);
    return {
      success: true,
      data: hobby,
    };
  }

  /**
   * PUT /hobbies/:id
   * Update a hobby
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body(new ZodValidationPipe(UpdateHobbySchema)) dto: UpdateHobbyDto) {
    const hobby = await this.hobbyService.update(id, dto);
    return {
      success: true,
      data: hobby,
    };
  }

  /**
   * DELETE /hobbies/:id
   * Delete a hobby
   */
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.hobbyService.delete(id);
    return {
      success: true,
    };
  }
}
