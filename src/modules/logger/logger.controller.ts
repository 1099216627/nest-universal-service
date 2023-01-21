import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { CheckPolicies } from '../../decorators/casl.decorator';
import { ActionEnum } from '../../common/enum/action.enum';
import { CaslGuard } from '../../guards/casl.guard';
import { JwtGuard } from '../../guards/jwt.guard';
import { Logger } from './entities/logger.entity';
import { GetLogsDto } from './dto/get-logs.dto';

@Controller('logs')
@UseGuards(JwtGuard, CaslGuard)
// @UseInterceptors(LoggerInterceptor)
export class LoggerController {
  constructor(private readonly logsService: LoggerService) {}

  @Get()
  @CheckPolicies((ability) => ability.can(ActionEnum.READ, Logger))
  getAllLogs(@Query() query: GetLogsDto) {
    return this.logsService.findAll(query);
  }
}
