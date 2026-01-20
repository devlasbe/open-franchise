import { Module } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { StatisticController } from './statistic.controller';

@Module({
  exports: [StatisticService],
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class StatisticModule {}
