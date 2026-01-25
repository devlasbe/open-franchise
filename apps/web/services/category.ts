import fetchService from '@/utils/fetchService';
import { GetCategoryListRes } from '@/types/apiTypes';
import constants from '@/constants';

export class CategoryService {
  static async getCategoryList() {
    const dataList = await fetchService<GetCategoryListRes>({
      path: 'category',
      init: {
        next: { revalidate: constants.CACHE_REVALIDATE_TIME },
      },
    });
    return dataList;
  }
}
