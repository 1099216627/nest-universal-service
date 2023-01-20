import { ConfigEnum } from './src/common/enum/config.enum';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

//entities实体目录
const entitiesDir =
  process.env.NODE_ENV === 'test'
    ? [__dirname + '/src/modules/**/*.entity.ts']
    : [__dirname + '/src/modules/**/*.entity{.ts,.js}'];
//读取配置文件
function getEnv(env: string): Record<string, unknown> {
  if (fs.existsSync(env)) {
    return dotenv.parse(fs.readFileSync(env));
  }
  return {};
}
//构建配置信息
function buildConnectionOption() {
  const defaultEnv = getEnv('.env');
  const env = getEnv(`.env.${process.env.NODE_ENV || 'development'}`);
  const config = { ...env, ...defaultEnv };
  return {
    type: config[ConfigEnum.DB_TYPE],
    host: config[ConfigEnum.DB_HOST],
    port: config[ConfigEnum.DB_PORT],
    username: config[ConfigEnum.DB_USERNAME],
    password: config[ConfigEnum.DB_PASSWORD],
    database: config[ConfigEnum.DB_DATABASE],
    synchronize: config[ConfigEnum.DB_SYNCHRONIZE],
    entities: entitiesDir,
  };
}

export const connectionOptions =
  buildConnectionOption() as TypeOrmModuleOptions;

export default new DataSource({
  ...connectionOptions,
  migrations: ['src/migrations/**'], //迁移目录
  subscribers: [],
} as DataSourceOptions);
