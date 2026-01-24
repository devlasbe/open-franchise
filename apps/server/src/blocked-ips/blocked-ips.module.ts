import { Module } from '@nestjs/common';
import { BlockedIpsController } from './blocked-ips.controller';
import { BlockedIpsService } from './blocked-ips.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BlockedIpsController],
  providers: [BlockedIpsService],
  exports: [BlockedIpsService],
})
export class BlockedIpsModule {}
