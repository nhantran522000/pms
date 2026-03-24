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
import { NoteService } from '../../application/services/note.service';
import { ZodValidationPipe } from '@pms/shared-kernel';
import {
  CreateNoteSchema,
  CreateNoteDto,
  UpdateNoteSchema,
  UpdateNoteDto,
} from '@pms/shared-types';
import { z } from 'zod';

const NoteQuerySchema = z.object({
  folderId: z.string().optional(),
});

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateNoteSchema)) dto: CreateNoteDto,
  ) {
    const note = await this.noteService.create(dto);
    return {
      success: true,
      data: note.toJSON(),
    };
  }

  @Get()
  async findAll(@Query() query: z.infer<typeof NoteQuerySchema>) {
    const notes = await this.noteService.findAll(query.folderId);
    return {
      success: true,
      data: notes.map((n) => n.toJSON()),
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const note = await this.noteService.findById(id);
    return {
      success: true,
      data: note.toJSON(),
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateNoteSchema)) dto: UpdateNoteDto,
  ) {
    const note = await this.noteService.update(id, dto);
    return {
      success: true,
      data: note.toJSON(),
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.noteService.delete(id);
    return {
      success: true,
      data: { message: 'Note deleted successfully' },
    };
  }
}
