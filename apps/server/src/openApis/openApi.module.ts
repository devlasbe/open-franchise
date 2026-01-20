import { Module } from '@nestjs/common';
import { OpenApiService } from './openApi.service';
import { OpenApiController } from './openApi.controller';

@Module({
  controllers: [OpenApiController],
  providers: [OpenApiService],
})
export class OpenApiModule {}
