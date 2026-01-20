module.exports = {
  apps: [
    {
      name: 'franchise-backend',
      script: './dist/src/main.js',
      exec_mode: 'cluster',
      instances: '2',
      max_memory_restart: '1000M',
      merge_logs: true,
      autorestart: true,
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        // [변경] 문자열 대신 실제 환경변수를 받아옵니다.
        DATABASE_URL: process.env.DATABASE_URL,
        OPENAPI_KEY: process.env.OPENAPI_KEY,
        DEFAULT_YEAR: process.env.DEFAULT_YEAR,
        JWT_SECRET: process.env.JWT_SECRET,
      },
    },
  ],
};
