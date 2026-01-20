import { Controller, Get, Query } from '@nestjs/common';
import { HeadsService } from './heads.service';
import { ApiExtraModels, ApiOkResponse } from '@nestjs/swagger';
import { GetHeadReq, GetHeadRes } from './dto/head.dto';

@Controller('heads')
export class HeadsController {
  constructor(private readonly headsService: HeadsService) {}

  @Get()
  @ApiOkResponse({
    description: '가맹본부 검색',
    type: GetHeadRes,
  })
  @ApiExtraModels(GetHeadReq)
  findOne(@Query() query: GetHeadReq) {
    return this.headsService.findOne(query.jnghdqrtrsMnno);
  }
}
