import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggerService } from '../modules/logger/logger.service';
import * as requestIp from 'request-ip';
/**
 * 日志系统
 * 自动记录请求method,url,成功或失败状态
 */
@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const name = Reflect.getMetadata('name', context.getHandler());
    if (!name) {
      return next.handle();
    }
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const path = request.url;
    const ip = requestIp.getClientIp(request);
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
