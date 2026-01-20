import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  AddRejectedBrandDto,
  GetBrandListReq,
  GetBrandListRes,
  GetBrandRes,
  GetRejectedBrandListRes,
} from './dto/brand.dto';
import { AdminAuthGuard } from 'src/auth/guards/AdminAuthGuard';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @ApiExtraModels(GetBrandListReq)
  @ApiOkResponse({
    description: '브랜드 리스트',
    type: GetBrandListRes,
  })
  findAll(@Query() query: GetBrandListReq) {
    return this.brandService.findByFilter(query);
  }

  @Get('rejection')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiExtraModels(GetBrandListReq)
  @ApiOkResponse({
    description: '차단된 브랜드 리스트',
    type: GetRejectedBrandListRes,
  })
  findRejected(@Query() query: GetBrandListReq) {
    return this.brandService.findAllRejected(query);
  }

  @Post('rejection')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiBody({ type: AddRejectedBrandDto })
  @ApiOkResponse({ description: '브랜드 차단 추가' })
  addRejected(@Body() dto: AddRejectedBrandDto) {
    return this.brandService.addRejected(dto.brandNm);
  }

  @Delete('rejection/:brandNm')
  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ description: '브랜드 차단 해제' })
  removeRejected(@Param('brandNm') brandNm: string) {
    return this.brandService.removeRejected(brandNm);
  }

  @Get('/:name')
  @ApiOkResponse({
    description: '브랜드 검색',
    type: GetBrandRes,
  })
  findByName(@Param('name') name: string) {
    return this.brandService.findOne(name);
  }
}
