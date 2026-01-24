import { ApiProperty } from '@nestjs/swagger';

export class Comment {
  @ApiProperty({ description: 'ID' })
  id: string;

  @ApiProperty({ description: '브랜드명' })
  brandNm: string;

  @ApiProperty({ description: '부모 댓글 ID', required: false })
  parentId: string | null;

  @ApiProperty({ description: '닉네임', required: false })
  nickname: string | null;

  @ApiProperty({ description: '내용' })
  content: string;

  @ApiProperty({ description: '삭제 여부' })
  isDeleted: boolean;

  @ApiProperty({ description: '생성 일시' })
  createdAt: Date;

  @ApiProperty({ description: '수정 일시' })
  updatedAt: Date;
}

export class CommentWithReplies extends Comment {
  @ApiProperty({ description: '대댓글 목록', type: [Comment] })
  replies: Comment[];
}

export class AdminComment extends Comment {
  @ApiProperty({ description: 'IP 주소' })
  ipAddress: string;

  @ApiProperty({ description: 'User Agent', required: false })
  userAgent: string | null;
}
