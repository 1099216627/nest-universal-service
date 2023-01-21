import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LogsService } from '../modules/logs/logs.service';
import * as requestIp from 'request-ip';
/**
 * 日志系统
 * 自动记录请求method,url,成功或失败状态
 */
@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LogsService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const path = request.url;
    const ip = requestIp.getClientIp(request);
    const startTime = Date.now();
    const userId = request.user.id;
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
            code: next.code,
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
            code: error.status,
          });
        },
      ),
    );
  }
}
