export type PaginationParams = { pageNo: number; pageSize: number };

export type PaginatedResult<T> = {
  items: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
};

export class PaginationUtil {
  static getSkipTake(params: PaginationParams): { skip: number; take: number } {
    return {
      skip: (params.pageNo - 1) * params.pageSize,
      take: params.pageSize,
    };
  }

  static createResult<T>(
    items: T[],
    totalCount: number,
    params: PaginationParams,
  ): PaginatedResult<T> {
    return {
      items,
      totalCount,
      totalPages: Math.ceil(totalCount / params.pageSize),
      currentPage: params.pageNo,
    };
  }
}
