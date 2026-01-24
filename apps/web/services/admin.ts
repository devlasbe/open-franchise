import fetchService from '@/utils/fetchService';

// 타입 정의
export type AdminComment = {
  id: string;
  brandNm: string;
  parentId: string | null;
  nickname: string | null;
  content: string;
  ipAddress: string;
  userAgent: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type BlockedIp = {
  id: string;
  ipPattern: string;
  reason: string | null;
  blockedBy: string;
  blockedAt: string;
  expiresAt: string | null;
  isActive: boolean;
};

type AdminCommentListRes = {
  payload: AdminComment[];
  request: string;
  count: number;
};

type BlockedIpListRes = {
  payload: BlockedIp[];
  request: string;
  count: number;
};

type BlockedIpRes = {
  payload: BlockedIp;
  request: string;
};

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

    return fetchService<AdminCommentListRes>({
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
    return fetchService<BlockedIpRes>({
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

    return fetchService<BlockedIpListRes>({
      path: `admin/blocked-ips?${query}`,
      isClient: true,
      init: {
        method: 'GET',
        credentials: 'include',
      },
    });
  }

  static async createBlockedIp(data: { ipPattern: string; reason?: string; expiresAt?: string }) {
    return fetchService<BlockedIpRes>({
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
    return fetchService<BlockedIpRes>({
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


