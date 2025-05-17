import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export interface RedisConfiguration {
  url: string;
}

export type DatabaseConfiguration = TypeOrmModuleOptions &
  Partial<PostgresConnectionOptions>;

export interface Configuration {
  env: 'development';
  port: number;
  secret: string;
  database: DatabaseConfiguration;
  redis: RedisConfiguration;
}