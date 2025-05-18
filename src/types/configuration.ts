import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

/**
 * Configuramos la app para usar Redis ya que es la forma en como se me ocurrio hacer el logout
 * dado a que es una base de datos en memoria
 */
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
