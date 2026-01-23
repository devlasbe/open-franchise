import fetchService from '@/utils/fetchService';
import { GetCategoryListRes } from '@/types/apiTypes';

export class CategoryService {
  static async getCategoryList() {
    const dataList = await fetchService<GetCategoryListRes>({ path: 'category' });
    return dataList;
  }
}
