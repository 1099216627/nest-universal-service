import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggerService } from '../modules/logger/logger.service';
import * as requestIp from 'request-ip';
import { HttpService } from '@nestjs/axios';
import { AxiosService } from '../common/lib/axios/axios.service';
/**
 * 日志系统
 * 自动记录请求method,url,成功或失败状态
 */
@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly axiosService: AxiosService,
  ) {}
  async intercept(context: ExecutionContext, next: CallHandler) {
    const name = Reflect.getMetadata('name', context.getHandler());
    if (!name) {
      return next.handle();
    }
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const path = request.url;
    const ip = requestIp.getClientIp(request).replace('::ffff:', '');
    const data = await this.axiosService.get(
      `https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?query=${ip}&co=&resource_id=6006&t=1555898284898&ie=utf8&oe=utf8&format=json&tn=baidu`,
    );
    const area = data[0]?.location || '';
    const startTime = Date.now();
    const userId = request.user?.id ?? null;
    return next.handle().pipe(
      tap(
        (next) => {
          const endTime = Date.now();
          const time = endTime - startTime;
          this.loggerService.create({
            method,
            path,
            ip,
            time,
            area,
            userId,
            code: next?.code || next?.status || 200,
            name,
          });
        },
        (error) => {
          const endTime = Date.now();
          const time = endTime - startTime;
          this.loggerService.create({
            method,
            path,
            area,
            ip,
            time,
            userId,
            code: error?.status || error?.code,
            name,
          });
        },
      ),
    );
  }
}
