import { Controller, Get, Query } from '@nestjs/common';
import { OpenApiService } from './openApi.service';

@Controller('openApi')
export class OpenApiController {
  constructor(private readonly openApiService: OpenApiService) {}

  @Get('brand')
  async brand(@Query('yr') yr: number) {
    const params = { numOfRows: 1000, pageNo: 1, yr: yr };
    await this.openApiService.callBrand(params);
    return { message: '성공' };
  }

  @Get('statistic')
  async statistic(@Query('yr') yr: number) {
    const params = { numOfRows: 1000, pageNo: 1, yr: yr };
    await this.openApiService.callStatistic(params);
    return { message: '성공' };
  }

  @Get('startup')
  async startup(@Query('yr') yr: number) {
    const params = { numOfRows: 1000, pageNo: 1, yr: yr };
    await this.openApiService.callStartup(params);
    return { message: '성공' };
  }
}
