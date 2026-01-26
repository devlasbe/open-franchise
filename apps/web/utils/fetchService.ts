import constants from '@/constants';

type MyFetchType = {
  path: RequestInfo | URL;
  init?: RequestInit;
  isClient?: boolean;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

const fetchService = async <T>({ path, init, isClient }: MyFetchType) => {
  try {
    const endPoint = isClient ? `/franchise/${path}` : `${constants.API_BASE_URL}/${path}`;

    // 서버 사이드일 때 자동으로 쿠키 헤더 추가
    if (!isClient && typeof window === 'undefined') {
      try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const cookieString = cookieStore.toString();

        if (cookieString) {
          init = {
            ...init,
            headers: {
              ...init?.headers,
              Cookie: cookieString,
            },
          };
        }
      } catch {
        // next/headers를 사용할 수 없는 환경은 무시
      }
    }

    const response = await fetch(endPoint, init);

    if (!response.ok) {
      console.error('[ERROR]', endPoint, response.status);

      // 서버의 에러 메시지 파싱 시도
      let errorMessage = 'API 응답 처리 실패';
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = Array.isArray(errorData.message)
            ? errorData.message[0]
            : errorData.message;
        }
      } catch {
        // JSON 파싱 실패 시 기본 메시지 사용
      }

      throw new ApiError(errorMessage, response.status);
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export default fetchService;
