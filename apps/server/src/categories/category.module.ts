import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { BrandModule } from 'src/brands/brand.module';

@Module({
  imports: [BrandModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
