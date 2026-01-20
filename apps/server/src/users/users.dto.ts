import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { User, UserWithoutPassword } from './users.entity';
import { UserRole } from '@prisma/client';
import { TypeUtil } from 'src/common/utils/type.util';

export class CreateUserReq {
  @ApiProperty({ description: '이메일 주소' })
  @IsEmail({}, { message: '이메일 형식이 올바르지 않습니다.' })
  email: string;

  @ApiProperty({ description: '비밀번호' })
  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  password: string;

  @ApiProperty({ description: '사용자 이름' })
  @IsString({ message: '이름은 문자열이어야 합니다.' })
  @MinLength(1, { message: '이름은 최소 1자 이상이어야 합니다.' })
  name: string;
}

export class CreateUserRes extends TypeUtil.getSuccessResponse(
  UserWithoutPassword,
) {}

export class FindUserAllRes extends TypeUtil.getSuccessResponseList(
  UserWithoutPassword,
) {}

export class FindUserByIdRes extends TypeUtil.getSuccessResponse(
  UserWithoutPassword,
) {}
