import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { GetCategoryListRes } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOkResponse({
    description: '카테고리 전체 리스트',
    type: GetCategoryListRes,
  })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('save')
  save() {
    return this.categoryService.save();
  }
}
