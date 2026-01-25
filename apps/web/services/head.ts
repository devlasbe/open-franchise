import fetchService from '@/utils/fetchService';
import { GetHeadRes } from '@/types/apiTypes';
import { QueryParamsUtil } from '@/utils/queryParams';
import constants from '@/constants';

export class HeadService {
  static async getHead(jnghdqrtrsMnno: string) {
    const params = {
      jnghdqrtrsMnno,
    };
    const dataList = await fetchService<GetHeadRes>({
      path: QueryParamsUtil.convert('heads', params),
      init: {
        next: { revalidate: constants.CACHE_REVALIDATE_TIME },
      },
    });
    return dataList;
  }
}
