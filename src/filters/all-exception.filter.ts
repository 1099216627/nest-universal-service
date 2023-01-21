import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpAdapterHost,
  HttpException,
  HttpStatus,
  LoggerService,
} from '@nestjs/common';
import * as requestIp from 'request-ip';
import { HttpCodeEnum } from '../common/enum/http-code.enum';
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private logger: LoggerService,
    private httpAdapterHost: HttpAdapterHost,
  ) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException ? exception.message : exception;
    if (message instanceof Array && message.length) {
      message = message[0];
    }
    if (status === HttpCodeEnum.FORBIDDEN) {
      message = '对不起，您没有权限访问该资源';
    }
    if (status === HttpCodeEnum.UNAUTHORIZED) {
      message = '对不起，请先登录';
    }
    if (status === HttpCodeEnum.NOT_FOUND) {
      message = '资源不存在';
    }
    const loggerResponse = {
      headers: request.headers,
      query: request.query,
      body: request.body,
      params: request.params,
      timestamp: new Date().toISOString(),
      ip: requestIp.getClientIp(request),
      status,
      message,
      method: request.method,
      url: request.url,
    };
    const responseBody = {
      code: status,
      data: null,
      message,
    };
    this.logger.error(exception['message'], loggerResponse);
    httpAdapter.reply(response, responseBody, status);
  }
}
