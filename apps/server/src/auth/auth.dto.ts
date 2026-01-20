import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { TypeUtil } from 'src/common/utils/type.util';
import { UserWithoutPassword } from 'src/users/users.entity';

export class LoginRequestDto {
  @ApiProperty({ description: '이메일' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '비밀번호' })
  @IsString()
  password: string;
}

export class LoginRes {
  @ApiProperty({ description: '로그인 성공 메시지' })
  message: string;
}

export class LoginResponseDto extends TypeUtil.getSuccessResponse(LoginRes) {}

export class LogoutRes {
  @ApiProperty({ description: '로그아웃 성공 메시지' })
  message: string;
}

export class LogoutResponseDto extends TypeUtil.getSuccessResponse(LogoutRes) {}

export class GetProfileResponseDto extends TypeUtil.getSuccessResponse(
  UserWithoutPassword,
) {}
