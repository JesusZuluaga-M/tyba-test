import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './resources/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Configuration } from './types/configuration';
import { User } from './entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { SessionMiddleware } from './middlewares/session.middleware';
import { CacheModule } from '@nestjs/cache-manager';
import { TransactionModule } from './resources/transaction/transaction.module';
import { RestaurantesModule } from './resources/restaurantes/restaurantes.module';
import * as redisStore from 'cache-manager-ioredis';

const env_file = '.env.' + process.env.NODE_ENV;

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: env_file,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        const configuration = configService.get('config') as Configuration;
        const database = configuration.database;
        const config = {
          type: 'postgres',
          host: database.host,
          port: database.port,
          username: database.username,
          password: database.password,
          database: database.database,
          entities: [User, Transaction],
          migrations: ['./migrations/*.js', './migrations/*.ts'],
        } as TypeOrmModuleOptions;

        return config;
      },
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory(configService: ConfigService) {
        const config = configService.get('config') as Configuration;
        const redisConfig = config.redis;
        return {
          store: redisStore,
          url: redisConfig.url,
        };
      },
      inject: [ConfigService],
    }),
    TransactionModule,
    RestaurantesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes('*');
  }
}
