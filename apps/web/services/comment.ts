import fetchService from '@/utils/fetchService';
import { QueryParamsUtil } from '@/utils/queryParams';

export type Comment = {
  id: string;
  brandNm: string;
  parentId: string | null;
  nickname: string | null;
  content: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
};

export type CommentsResponse = {
  payload: {
    comments: Comment[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
};

export type GetCommentsParams = {
  pageNo: number;
  pageSize: number;
};

export type CreateCommentParams = {
  nickname?: string;
  password: string;
  content: string;
};

export type CreateReplyParams = CreateCommentParams;

export type DeleteCommentParams = {
  password: string;
};

export class CommentService {
  static async getComments(brandNm: string, params: GetCommentsParams) {
    const data = await fetchService<CommentsResponse>({
      path: QueryParamsUtil.convert(`brands/${encodeURIComponent(brandNm)}/comments`, params),
      isClient: true,
    });
    return data;
  }

  static async createComment(brandNm: string, data: CreateCommentParams) {
    return await fetchService<{ payload: Comment }>({
      path: `brands/${encodeURIComponent(brandNm)}/comments`,
      init: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
      isClient: true,
    });
  }

  static async createReply(commentId: string, data: CreateReplyParams) {
    return await fetchService<{ payload: Comment }>({
      path: `comments/${commentId}/replies`,
      init: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
      isClient: true,
    });
  }

  static async deleteComment(commentId: string, password: string) {
    return await fetchService({
      path: `comments/${commentId}`,
      init: {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      },
      isClient: true,
    });
  }

  static async blockCommentIp(commentId: string, data?: { reason?: string }) {
    return await fetchService<{ payload: { id: string; ipPattern: string } }>({
      path: `admin/comments/${commentId}/block-ip`,
      init: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data || {}),
      },
      isClient: true,
    });
  }

  static async forceDeleteComment(commentId: string) {
    return await fetchService({
      path: `admin/comments/${commentId}`,
      init: {
        method: 'DELETE',
        credentials: 'include',
      },
      isClient: true,
    });
  }
}
