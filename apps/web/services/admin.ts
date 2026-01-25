import fetchService from '@/utils/fetchService';
import type {
  GetAdminCommentsRes,
  GetBlockedIpListRes,
  GetBlockedIpRes,
  BlockCommentIpRes,
} from '@/types/apiTypes';

export class AdminService {
  // --- OpenAPI 데이터 수집 ---
  static async callBrand(yr: number) {
    return fetchService({ path: `openApi/brand?yr=${yr}`, isClient: true });
  }
  static async callStatistic(yr: number) {
    return fetchService({ path: `openApi/statistic?yr=${yr}`, isClient: true });
  }
  static async callStartup(yr: number) {
    return fetchService({ path: `openApi/startup?yr=${yr}`, isClient: true });
  }

  // --- 댓글 관리 API ---
  static async getComments(params: {
    pageNo: number;
    pageSize: number;
    brandNm?: string;
    ipAddress?: string;
  }) {
    const query = new URLSearchParams({
      pageNo: params.pageNo.toString(),
      pageSize: params.pageSize.toString(),
      ...(params.brandNm && { brandNm: params.brandNm }),
      ...(params.ipAddress && { ipAddress: params.ipAddress }),
    }).toString();

    return fetchService<GetAdminCommentsRes>({
      path: `admin/comments?${query}`,
      isClient: true,
      init: {
        method: 'GET',
        credentials: 'include',
      },
    });
  }

  static async deleteComment(commentId: string) {
    return fetchService({
      path: `admin/comments/${commentId}`,
      isClient: true,
      init: {
        method: 'DELETE',
        credentials: 'include',
      },
    });
  }

  static async blockCommentIp(commentId: string, reason?: string) {
    return fetchService<BlockCommentIpRes>({
      path: `admin/comments/${commentId}/block-ip`,
      isClient: true,
      init: {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      },
    });
  }

  // --- 차단 IP 관리 API ---
  static async getBlockedIps(params: {
    pageNo: number;
    pageSize: number;
    ipPattern?: string;
    isActive?: boolean;
  }) {
    const query = new URLSearchParams({
      pageNo: params.pageNo.toString(),
      pageSize: params.pageSize.toString(),
      ...(params.ipPattern && { ipPattern: params.ipPattern }),
      ...(params.isActive !== undefined && { isActive: params.isActive.toString() }),
    }).toString();

    return fetchService<GetBlockedIpListRes>({
      path: `admin/blocked-ips?${query}`,
      isClient: true,
      init: {
        method: 'GET',
        credentials: 'include',
      },
    });
  }

  static async createBlockedIp(data: { ipPattern: string; reason?: string; expiresAt?: string }) {
    return fetchService<GetBlockedIpRes>({
      path: 'admin/blocked-ips',
      isClient: true,
      init: {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
    });
  }

  static async updateBlockedIp(
    id: string,
    data: { ipPattern?: string; reason?: string; expiresAt?: string; isActive?: boolean },
  ) {
    return fetchService<GetBlockedIpRes>({
      path: `admin/blocked-ips/${id}`,
      isClient: true,
      init: {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
    });
  }

  static async deleteBlockedIp(id: string) {
    return fetchService({
      path: `admin/blocked-ips/${id}`,
      isClient: true,
      init: {
        method: 'DELETE',
        credentials: 'include',
      },
    });
  }
}


