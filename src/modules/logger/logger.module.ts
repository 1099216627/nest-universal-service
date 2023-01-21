import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerController } from './logger.controller';
import { utilities, WinstonModule, WinstonModuleOptions } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import { Console } from 'winston/lib/winston/transports';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { LogEnum } from '../../common/enum/config.enum';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logger } from './entities/logger.entity';

type Level = 'error' | 'warn' | 'info' | 'debug';
function createDailyRotateFileTransport(level: Level, filename: string) {
  return new DailyRotateFile({
    level,
    dirname: 'logs',
    filename: `${filename}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true, //压缩
    maxSize: '20m', //最大20m
    maxFiles: '14d', //最多14天
    format: winston.format.combine(
      winston.format.prettyPrint(),
      winston.format.timestamp(), //时间戳
    ),
  });
}
@Global()
@Module({
  controllers: [LoggerController],
  providers: [LoggerService],
  imports: [
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const consoleTransport = new Console({
          level: 'info',
          format: winston.format.combine(
            winston.format.prettyPrint(),
            winston.format.timestamp(),
            utilities.format.nestLike(), //nest日志格式
          ),
        });
        return {
          transports: [
            consoleTransport,
            ...(configService.get(LogEnum.LOG_ON)
              ? [
                  createDailyRotateFileTransport('info', 'application'),
                  createDailyRotateFileTransport('warn', 'error'),
                ]
              : []),
          ],
        } as WinstonModuleOptions;
      },
    }),
    TypeOrmModule.forFeature([Logger]),
  ],
  exports: [LoggerService],
})
export class LoggerModule {}
