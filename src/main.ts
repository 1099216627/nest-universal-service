import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './filters/all-exception.filter';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
async function bootstrap() {  
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,//允许跨域
      credentials: true,//允许携带cookie
    }
  });
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.setGlobalPrefix('api/v1');
  
  //filter
  const httpAdapter = app.get(HttpAdapterHost); //获取http适配器
  app.useGlobalFilters(new AllExceptionFilter(new Logger(), httpAdapter));
  //pipe
  app.useGlobalPipes(new ValidationPipe());
  rateLimit
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000,
    })
  );
  //helmet头部安全，防止xss攻击
  app.use(helmet());
  await app.listen(3000);
}
bootstrap();
