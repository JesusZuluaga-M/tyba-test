import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './resources/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Configuration } from './types/configuration';
import { User } from './entities/user.entity'
import { Transaction } from './entities/transaction.entity';


const env_file = '.env.' + process.env.NODE_ENV;

@Module({
  imports: [AuthModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: env_file,
    load: [configuration],
  }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        const configuration = configService.get('config') as Configuration;
        const database = configuration.database;
        const config = {
          type: database.driver,
          host: database.host,
          port: database.port,
          username: database.username,
          password: database.password,
          database: database.database,
          entities: [User, Transaction],
          migrations: ['./migrations/*.js', './migrations/*.ts']
        } as TypeOrmModuleOptions;

        console.log(config);
        return config;
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
