import { mixin } from '@nestjs/common';
import {
  SuccessResponse,
  SuccessResponseList,
} from '../interceptors/success-response/success-response.dto';
import { ApiProperty } from '@nestjs/swagger';

type Constructor<T = object> = new (...args: any[]) => T;

/**
 * Swagger 제네릭 타입 인식 못하는 문제 해결을 위해 만든 Util
 */
export class TypeUtil {
  static getSuccessResponse<T extends Constructor>(Base: T) {
    class Class extends SuccessResponse<T> {
      @ApiProperty({ type: Base, description: '응답 데이터' })
      payload: T;
    }
    return class SuccessResponse extends mixin(Class) {};
  }
  static getSuccessResponseList<T extends Constructor>(Base: T) {
    class Class extends SuccessResponseList<T> {
      @ApiProperty({ type: [Base], description: '응답 데이터' })
      payload: T;
    }
    return class SuccessResponseList extends mixin(Class) {};
  }
}
