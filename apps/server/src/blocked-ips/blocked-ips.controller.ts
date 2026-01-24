import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/auth/guards/AdminAuthGuard';
import { BlockedIpsService } from './blocked-ips.service';
import {
  CreateBlockedIpReq,
  GetBlockedIpListReq,
  GetBlockedIpListRes,
  GetBlockedIpRes,
  UpdateBlockedIpReq,
} from './dto/blocked-ip.dto';
import { Request } from 'express';

type AuthenticatedRequest = Request & {
  user: { id: string };
};

@ApiTags('Admin - Blocked IPs')
@Controller('admin/blocked-ips')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('access-token')
export class BlockedIpsController {
  constructor(private readonly blockedIpsService: BlockedIpsService) {}

  @Post()
  @ApiBody({ type: CreateBlockedIpReq })
  @ApiOkResponse({ description: 'IP 차단 추가', type: GetBlockedIpRes })
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateBlockedIpReq) {
    const adminId = req.user.id;
    return this.blockedIpsService.create(adminId, dto);
  }

  @Get()
  @ApiExtraModels(GetBlockedIpListReq)
  @ApiOkResponse({ description: '차단 IP 목록', type: GetBlockedIpListRes })
  findAll(@Query() query: GetBlockedIpListReq) {
    return this.blockedIpsService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ description: '차단 IP 조회', type: GetBlockedIpRes })
  findOne(@Param('id') id: string) {
    return this.blockedIpsService.findOne(id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateBlockedIpReq })
  @ApiOkResponse({ description: '차단 IP 수정', type: GetBlockedIpRes })
  update(@Param('id') id: string, @Body() dto: UpdateBlockedIpReq) {
    return this.blockedIpsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: '차단 IP 삭제' })
  remove(@Param('id') id: string) {
    return this.blockedIpsService.remove(id);
  }
}
