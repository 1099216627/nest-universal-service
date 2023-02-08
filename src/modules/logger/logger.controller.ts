import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LoggerService } from './logger.service';
import { Can, CheckPolicies } from '../../decorators/casl.decorator';
import { ActionEnum } from '../../common/enum/action.enum';
import { CaslGuard } from '../../guards/casl.guard';
import { JwtGuard } from '../../guards/jwt.guard';
import { Logger } from './entities/logger.entity';
import { GetLogsDto } from './dto/get-logs.dto';
import { LoggerInterceptor } from '../../interceptors/logger.interceptor';
import { setRouteNameDecorator } from '../../decorators/set-route-name.decorator';

@Controller('logs')
@UseGuards(JwtGuard, CaslGuard)
@UseInterceptors(LoggerInterceptor, LoggerInterceptor)
export class LoggerController {
  constructor(private readonly logsService: LoggerService) {}

  @Get()
  // @CheckPolicies((ability) => ability.can(ActionEnum.READ, Logger))
  @Can(ActionEnum.READ, Logger)
  @setRouteNameDecorator('查询日志')
  async getAllLogs(@Query() query: GetLogsDto) {
    return await this.logsService.findAll(query);
  }
}
