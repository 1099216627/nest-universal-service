import { LoggerService } from './../modules/logger/logger.service';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor(private readonly loggerService: LoggerService) {}

  //每小时执行一次
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    await this.loggerService.deleteAll();
  }
}
