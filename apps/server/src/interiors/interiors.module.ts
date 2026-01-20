import { Module } from '@nestjs/common';
import { InteriorsService } from './interiors.service';
import { InteriorsController } from './interiors.controller';

@Module({
  controllers: [InteriorsController],
  providers: [InteriorsService],
})
export class InteriorsModule {}
