import * as dotenv from 'dotenv';
import * as path from 'path';
import { defineConfig, env } from 'prisma/config';

// NODE_ENV에 맞는 .env 파일 로드
const nodeEnv = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(process.cwd(), `.env.${nodeEnv}`) });
dotenv.config({ path: path.resolve(process.cwd(), '.env') }); // fallback

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
