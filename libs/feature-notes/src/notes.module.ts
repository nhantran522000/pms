import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@pms/data-access';
import { SearchController, JournalController } from './presentation/controllers';
import { SearchService, JournalService } from './application/services';
import { FullTextSearchService } from './infrastructure/services';
import { JournalEntryRepository } from './infrastructure/repositories';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [SearchController, JournalController],
  providers: [
    SearchService,
    JournalService,
    FullTextSearchService,
    JournalEntryRepository,
  ],
  exports: [SearchService, JournalService],
})
export class NotesModule {}
