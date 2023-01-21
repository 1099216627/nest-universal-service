import { Global, Logger, Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi'; //joi是一个用于验证的库
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsModule } from './modules/logs/logs.module';
import { RolesModule } from './modules/roles/roles.module';
import { ProfileModule } from './modules/profile/profile.module';
import { connectionOptions } from '../ormconfig';
import { AuthModule } from './modules/auth/auth.module';
import { MenuModule } from './modules/menu/menu.module';
import { UploadModule } from './modules/upload/upload.module';
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
    TypeOrmModule.forRoot(connectionOptions),
    LogsModule,
    RolesModule,
    ProfileModule,
    AuthModule,
    UsersModule,
    MenuModule,
    UploadModule,
  ],
  providers: [Logger],
  exports: [Logger],
})
export class AppModule {}
