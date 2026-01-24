import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExtraModels, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/auth/guards/AdminAuthGuard';
import { CommentsService } from './comments.service';
import {
  BlockCommentIpReq,
  BlockCommentIpRes,
  GetAdminCommentsReq,
  GetAdminCommentsRes,
} from './dto/comment.dto';
import { Request } from 'express';

@ApiTags('Admin - Comments')
@Controller('admin/comments')
@UseGuards(AdminAuthGuard)
@ApiBearerAuth('access-token')
export class CommentsAdminController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @ApiExtraModels(GetAdminCommentsReq)
  @ApiOkResponse({ description: '전체 댓글 조회 (관리자)', type: GetAdminCommentsRes })
  findAll(@Query() query: GetAdminCommentsReq) {
    return this.commentsService.findAllAdmin(query);
  }

  @Delete(':id')
  @ApiOkResponse({ description: '댓글 강제 삭제' })
  forceDelete(@Param('id') id: string) {
    return this.commentsService.forceDelete(id);
  }

  @Post(':id/block-ip')
  @ApiBody({ type: BlockCommentIpReq })
  @ApiOkResponse({ description: '댓글 작성자 IP 차단', type: BlockCommentIpRes })
  blockIp(@Param('id') id: string, @Req() req: Request, @Body() dto: BlockCommentIpReq) {
    const adminId = (req.user as { id: string }).id;
    return this.commentsService.blockCommentIp(id, adminId, dto);
  }
}
