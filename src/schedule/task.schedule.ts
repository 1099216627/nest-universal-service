import { LoggerService } from './../modules/logger/logger.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor(private readonly loggerService: LoggerService) {}

  //每小时执行一次
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    console.log('定时任务开始');

    await this.loggerService.deleteAll();
  }
}