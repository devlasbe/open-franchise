const constants = {
  API_URL_DEV: process.env.NEXT_PUBLIC_API_URL_DEV || '',
  API_URL_PROD: process.env.NEXT_PUBLIC_API_URL_PROD || '',
  API_BASE_URL:
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_API_URL_DEV
      : process.env.NEXT_PUBLIC_API_URL_PROD,
  DEFAULT_YEAR: Number(process.env.NEXT_PUBLIC_DEFAULT_YEAR || '2024'),
  DOMAIN: process.env.NEXT_PUBLIC_DOMAIN || '',
  IS_DEV: process.env.NODE_ENV === 'development',
  IS_PROD: process.env.NODE_ENV === 'production',
  NODE_ENV: process.env.NODE_ENV || 'development',
  CACHE_REVALIDATE_TIME: 43200, // 12시간 (초 단위)
} as const;

export default constants;
