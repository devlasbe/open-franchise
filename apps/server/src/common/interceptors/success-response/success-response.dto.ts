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
