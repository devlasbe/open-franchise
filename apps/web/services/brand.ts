import fetchService from '@/utils/fetchService';
import { GetBrandListReq, GetBrandListRes, GetBrandRes, GetRejectedBrandListRes } from '@/types/apiTypes';
import { QueryParamsUtil } from '@/utils/queryParams';
import constants from '@/constants';

export class BrandService {
  static async getBrandList(params: GetBrandListReq, isServer?: boolean) {
    const data = await fetchService<GetBrandListRes>({
      path: QueryParamsUtil.convert('brand', params),
      init: {
        next: { revalidate: constants.CACHE_REVALIDATE_TIME },
      },
      isClient: !isServer,
    });
    return data;
  }
  static async getBrand(name: string) {
    const data = await fetchService<GetBrandRes>({
      path: `brand/${name}`,
      init: {
        next: { revalidate: constants.CACHE_REVALIDATE_TIME },
      },
    });
    return data;
  }

  static async getRejectedBrandList(params: GetBrandListReq, isServer?: boolean) {
    const data = await fetchService<GetRejectedBrandListRes>({
      path: QueryParamsUtil.convert('brand/rejection', params),
      init: {
        credentials: 'include',
      },
      isClient: !isServer,
    });
    return data;
  }

  static async addRejectedBrand(brandNm: string) {
    const data = await fetchService({
      path: 'brand/rejection',
      init: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ brandNm }),
        credentials: 'include',
      },
      isClient: true,
    });
    return data;
  }

  static async deleteRejectedBrand(brandNm: string) {
    const data = await fetchService({
      path: `brand/rejection/${brandNm}`,
      init: {
        method: 'DELETE',
        credentials: 'include',
      },
      isClient: true,
    });
    return data;
  }
}
