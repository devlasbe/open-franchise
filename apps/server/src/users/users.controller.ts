import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateUserReq,
  CreateUserRes,
  FindUserAllRes,
  FindUserByIdRes,
} from './users.dto';
import { AdminAuthGuard } from 'src/auth/guards/AdminAuthGuard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({
    summary: '사용자 조회',
    description: '사용자 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 정보가 성공적으로 조회됨',
    type: FindUserByIdRes,
  })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없음',
  })
  async findById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return user;
  }

  @UseGuards(AdminAuthGuard)
  @Get()
  @ApiOperation({
    summary: '사용자 목록 조회',
    description: '사용자 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 목록이 성공적으로 조회됨',
    type: FindUserAllRes,
  })
  async findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @ApiOperation({
    summary: '사용자 생성',
    description: '새로운 사용자를 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '사용자가 성공적으로 생성됨',
    type: CreateUserRes,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터',
  })
  async signup(@Body() userData: CreateUserReq) {
    return this.usersService.createUser(userData);
  }
}
