import { TypeUtil } from 'src/common/utils/type.util';
import { Category } from '../entities/category.entity';

export class GetCategoryListRes extends TypeUtil.getSuccessResponseList(
  Category,
) {}
