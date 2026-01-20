import { Controller, Get, Param } from '@nestjs/common';
import { StartupsService } from './startups.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { GetStartupRes } from './dto/startup.dto';

@Controller('startups')
export class StartupsController {
  constructor(private readonly startupsService: StartupsService) {}

  @Get(':name')
  @ApiOkResponse({
    description: '브랜드 이름에 해당하는 창업 금액 정보',
    type: GetStartupRes,
  })
  findOne(@Param('name') name: string) {
    return this.startupsService.findOne(name);
  }
}
