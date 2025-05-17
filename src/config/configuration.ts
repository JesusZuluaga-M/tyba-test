import { Configuration } from '../types/configuration';
import { registerAs } from '@nestjs/config';

const acceptableEnvironments = ['development', 'production'];

export default registerAs('config', (): Configuration => {
  const env = process.env.NODE_ENV ?? 'development';
  return {
    env: acceptableEnvironments.includes(env) ? (env as any) : 'development',
    port: parseInt(process.env.PORT ?? '3000', 10),
    secret: process.env.SECRET_KEY!,
    database: {
      driver: process.env.DB_DRIVER as any,
      host: process.env.DB_HOST!,
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_DATABASE!,
      pool: {
        max: parseInt(process.env.DB_POOL_MAX ?? '10', 10),
        min: parseInt(process.env.DB_POOL_MIN ?? '0', 10),
      },
    },
    redis: {
      url: process.env.REDIS_URL!,
    },
  };
});