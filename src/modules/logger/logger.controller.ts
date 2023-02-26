import { ResultData } from './../../common/utils/index';
import {
  Body,
  Controller,
  Delete,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LoggerService } from './logger.service';
import { Can } from '../../decorators/casl.decorator';
import { CaslGuard } from '../../guards/casl.guard';
import { JwtGuard } from '../../guards/jwt.guard';
import { Logger } from './entities/logger.entity';
import { GetLogsDto } from './dto/get-logs.dto';
import { LoggerInterceptor } from '../../interceptors/logger.interceptor';
import { setRouteNameDecorator } from '../../decorators/set-route-name.decorator';
import { DeleteLogDto } from './dto/delete-log.dto';
import { LogAction } from 'src/common/enum/action.enum';

@Controller('log')
@UseGuards(JwtGuard, CaslGuard)
@UseInterceptors(LoggerInterceptor)
export class LoggerController {
  constructor(private readonly logsService: LoggerService) {}

  @Get('list')
  @Can(LogAction.READ, Logger)
  async getAllLogs(@Query() query: GetLogsDto): Promise<ResultData> {
    return await this.logsService.findAll(query);
  }

  @Delete()
  @Can(LogAction.DELETE, Logger)
  async deleteLogs(@Body() deleteLogDto: DeleteLogDto): Promise<ResultData> {
    return await this.logsService.deleteByTime(deleteLogDto);
  }

  @Delete('all')
  @Can(LogAction.DELETE, Logger)
  async deleteAllLogs(): Promise<ResultData> {
    return await this.logsService.deleteAll();
  }
}
