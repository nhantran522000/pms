import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@pms/data-access';
import { SearchController } from './presentation/controllers';
import { SearchService } from './application/services';
import { FullTextSearchService } from './infrastructure/services';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [SearchController],
  providers: [SearchService, FullTextSearchService],
  exports: [SearchService],
})
export class NotesModule {}
