import fetchService from '@/utils/api';

export class AdminService {
  static async callBrand(yr: number) {
    return fetchService({ path: `openApi/brand?yr=${yr}`, isClient: true });
  }
  static async callStatistic(yr: number) {
    return fetchService({ path: `openApi/statistic?yr=${yr}`, isClient: true });
  }
  static async callStartup(yr: number) {
    return fetchService({ path: `openApi/startup?yr=${yr}`, isClient: true });
  }
}


