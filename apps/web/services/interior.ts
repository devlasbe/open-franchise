import fetchService from '@/utils/fetchService';
import { GetInteriorReq, GetInteriorRes } from '@/types/apiTypes';
import { QueryParamsUtil } from '@/utils/queryParams';
import constants from '@/constants';

export class InteriorService {
  static async getInterior(brandMnno: string) {
    const params: GetInteriorReq = {
      brandMnno,
    };
    const dataList = await fetchService<GetInteriorRes>({
      path: QueryParamsUtil.convert('interiors', params),
      init: {
        next: { revalidate: constants.CACHE_REVALIDATE_TIME },
      },
    });
    return dataList;
  }
}
