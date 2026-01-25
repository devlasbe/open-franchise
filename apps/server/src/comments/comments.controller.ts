import { Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiBody, ApiExtraModels, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import {
  CreateCommentReq,
  CreateReplyReq,
  DeleteCommentReq,
  GetCommentRes,
  GetCommentsReq,
  GetCommentsRes,
} from './dto/comment.dto';
import { Request } from 'express';
import { IpUtil } from 'src/common/utils';

@ApiTags('Comments')
@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('brands/:brandNm/comments')
  @ApiExtraModels(GetCommentsReq)
  @ApiOkResponse({ description: '댓글 목록', type: GetCommentsRes })
  findAll(@Param('brandNm') brandNm: string, @Query() query: GetCommentsReq) {
    return this.commentsService.findAll(decodeURIComponent(brandNm), query);
  }

  @Post('brands/:brandNm/comments')
  @ApiBody({ type: CreateCommentReq })
  @ApiOkResponse({ description: '댓글 작성', type: GetCommentRes })
  create(@Param('brandNm') brandNm: string, @Body() dto: CreateCommentReq, @Req() req: Request) {
    const ipAddress = IpUtil.getClientIp(req);
    const userAgent = req.headers['user-agent'];
    return this.commentsService.create(decodeURIComponent(brandNm), dto, ipAddress, userAgent);
  }

  @Post('comments/:id/replies')
  @ApiBody({ type: CreateReplyReq })
  @ApiOkResponse({ description: '대댓글 작성', type: GetCommentRes })
  createReply(@Param('id') id: string, @Body() dto: CreateReplyReq, @Req() req: Request) {
    const ipAddress = IpUtil.getClientIp(req);
    const userAgent = req.headers['user-agent'];
    return this.commentsService.createReply(id, dto, ipAddress, userAgent);
  }

  @Delete('comments/:id')
  @ApiBody({ type: DeleteCommentReq })
  @ApiOkResponse({ description: '댓글 삭제' })
  delete(@Param('id') id: string, @Body() dto: DeleteCommentReq) {
    return this.commentsService.delete(id, dto);
  }
}
