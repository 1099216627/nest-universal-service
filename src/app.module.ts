import { Global, Logger, LoggerService, Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi'; //joi是一个用于验证的库
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from './modules/logger/logger.module';
import { RolesModule } from './modules/roles/roles.module';
import { ProfileModule } from './modules/profile/profile.module';
import { connectionOptions } from '../ormconfig';
import { AuthModule } from './modules/auth/auth.module';
import { MenuModule } from './modules/menu/menu.module';
import { UploadModule } from './modules/upload/upload.module';
import { ResourcesModule } from './modules/resources/resources.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigEnum } from './common/enum/config.enum';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './schedule/task.schedule';
const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`; //env区分环境
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // 以下为dotenv的配置
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
      // 以下为joi的配置
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        DB_HOST: Joi.string().default('localhost'),
        DB_PORT: Joi.number().default(3306),
        DB_USERNAME: Joi.string().default('root'),
        DB_PASSWORD: Joi.string().default('example'),
        DB_DATABASE: Joi.string().default('nest'),
        DB_TYPE: Joi.string().valid('mysql', 'mariadb').default('mysql'),
        DB_SYNCHRONIZE: Joi.boolean().default(false),
        LOG_LEVEL: Joi.string()
          .valid('error', 'warn', 'info', 'debug')
          .default('debug'),
        LOG_ON: Joi.boolean().default(true),
      }),
    }),
    // Redis集成
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService, logger: LoggerService) => {
        const host = configService.get(ConfigEnum.REDIS_HOST);
        const port = configService.get(ConfigEnum.REDIS_PORT);
        const password = configService.get(ConfigEnum.REDIS_PASSWORD);
        const url = password
          ? `redis://${password}@${host}:${port}`
          : `redis://${host}:${port}`;
        return {
          config: {
            url,
            reconnectOnError: (err) => {
              logger.error(`Redis Connection error: ${err}`);
              return true;
            },
          },
        };
      },
      inject: [ConfigService, Logger],
    }),
    // 定时任务
    ScheduleModule.forRoot(),

    TypeOrmModule.forRoot(connectionOptions),
    LoggerModule,
    RolesModule,
    ProfileModule,
    AuthModule,
    UsersModule,
    MenuModule,
    UploadModule,
    ResourcesModule,
  ],
  providers: [Logger, TasksService],
  exports: [Logger],
})
export class AppModule {}
