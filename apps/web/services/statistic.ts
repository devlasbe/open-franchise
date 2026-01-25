import fetchService from '@/utils/fetchService';
import { GetStartupRes, GetStatisticByFilterReq, GetStatisticListRes } from '@/types/apiTypes';
import { QueryParamsUtil } from '@/utils/queryParams';
import constants from '@/constants';

export class StatisticService {
  static async getStatistic(name: string) {
    const dataList = await fetchService<GetStatisticListRes>({
      path: `statistic/${name}`,
      init: {
        next: { revalidate: constants.CACHE_REVALIDATE_TIME },
      },
    });
    return dataList;
  }
  static async getStatisticByFilter(params: GetStatisticByFilterReq) {
    const data = await fetchService<GetStatisticListRes>({
      path: QueryParamsUtil.convert('statistic', params),
      init: {
        next: { revalidate: constants.CACHE_REVALIDATE_TIME },
      },
    });
    return data;
  }
  static async getStartup(name: string) {
    const dataList = await fetchService<GetStartupRes>({
      path: `startups/${name}`,
      init: {
        next: { revalidate: constants.CACHE_REVALIDATE_TIME },
      },
    });
    return dataList;
  }
}
