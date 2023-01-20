import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        return plainToInstance(this.dto, data, {
          //excludeExtraneousValues设置为true，这样就不会把多余的字段返回给客户端
          //@Exclude()装饰器设置需要排除的字段
          //@Expose()装饰器设置需要暴露的字段
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
