import fetchService from '@/utils/fetchService';
import { QueryParamsUtil } from '@/utils/queryParams';
import type {
  GetCommentsRes,
  GetCommentsReq,
  CreateCommentReq,
  CreateReplyReq,
  GetCommentRes,
  BlockCommentIpRes,
} from '@/types/apiTypes';

export class CommentService {
  static async getComments(
    brandNm: string,
    params: Pick<GetCommentsReq, 'pageNo' | 'pageSize'>,
  ) {
    const data = await fetchService<GetCommentsRes>({
      path: QueryParamsUtil.convert(`brands/${encodeURIComponent(brandNm)}/comments`, params),
      isClient: true,
    });
    return data;
  }

  static async createComment(brandNm: string, data: CreateCommentReq) {
    return await fetchService<GetCommentRes>({
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

  static async createReply(commentId: string, data: CreateReplyReq) {
    return await fetchService<GetCommentRes>({
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
    return await fetchService<BlockCommentIpRes>({
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
