import { Controller, Get, Query } from '@nestjs/common';
import { InteriorsService } from './interiors.service';
import { ApiExtraModels, ApiOkResponse } from '@nestjs/swagger';
import { GetInteriorReq, GetInteriorRes } from './dto/interior.dto';
import { GetHeadReq } from 'src/heads/dto/head.dto';

@Controller('interiors')
export class InteriorsController {
  constructor(private readonly interiorsService: InteriorsService) {}

  @Get()
  @ApiOkResponse({
    description: '인테리어금액 검색',
    type: GetInteriorRes,
  })
  @ApiExtraModels(GetInteriorReq)
  findOne(@Query() query: GetInteriorReq) {
    return this.interiorsService.findOne(query.brandMnno);
  }
}
