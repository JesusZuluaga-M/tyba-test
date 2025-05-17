// src/config.ts
import { ConfigFactory } from '@nestjs/config';

export const loadEnv: ConfigFactory = () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  },
});
