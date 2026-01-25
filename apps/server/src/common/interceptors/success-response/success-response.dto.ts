import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse<T> {
  @ApiProperty({ description: '응답 데이터' })
  payload: T;
  @ApiProperty({ description: '호출된 URI' })
  request: string;
}

export class SuccessResponseList<T> extends SuccessResponse<T> {
  @ApiProperty({ description: 'payload 배열의 length' })
  count: number;
}

export class PaginatedResponse<T> extends SuccessResponse<T[]> {
  @ApiProperty({ description: '전체 개수' })
  totalCount: number;

  @ApiProperty({ description: '전체 페이지 수' })
  totalPages: number;

  @ApiProperty({ description: '현재 페이지' })
  currentPage: number;
}
