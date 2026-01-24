import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsAdminController } from './comments-admin.controller';
import { CommentsService } from './comments.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BlockedIpsModule } from 'src/blocked-ips/blocked-ips.module';

@Module({
  imports: [PrismaModule, BlockedIpsModule],
  controllers: [CommentsController, CommentsAdminController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
