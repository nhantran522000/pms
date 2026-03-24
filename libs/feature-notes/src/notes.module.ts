import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@pms/data-access';
import {
  NoteController,
  FolderController,
  TagController,
  SearchController,
  JournalController,
  MoodTrendsController,
} from './presentation/controllers';
import {
  NoteService,
  FolderService,
  TagService,
  SearchService,
  JournalService,
  MoodTrendsService,
} from './application/services';
import { FullTextSearchService } from './infrastructure/services';
import {
  NoteRepository,
  FolderRepository,
  TagRepository,
  JournalEntryRepository,
} from './infrastructure/repositories';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [
    NoteController,
    FolderController,
    TagController,
    SearchController,
    JournalController,
    MoodTrendsController,
  ],
  providers: [
    NoteService,
    FolderService,
    TagService,
    SearchService,
    JournalService,
    MoodTrendsService,
    NoteRepository,
    FolderRepository,
    TagRepository,
    JournalEntryRepository,
    FullTextSearchService,
  ],
  exports: [
    NoteService,
    FolderService,
    TagService,
    SearchService,
    JournalService,
    MoodTrendsService,
  ],
})
export class NotesModule {}
