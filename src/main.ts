import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './filters/all-exception.filter';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
// const httpsOptions = {
//   cert: fs.readFileSync('./ssl/cert.pem'),
//   key: fs.readFileSync('./ssl/key.pem'),
// };
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  app.enableCors({
    origin: 'https://www.jerry-cabin.top',
    credentials: true, //允许跨域携带cookie
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    maxAge: 3600,
    // preflightContinue: false,
  });
  //cors配置，仅让jerry-cabin.top域名访问
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.setGlobalPrefix('api/v1');

  //filter
  const httpAdapter = app.get(HttpAdapterHost); //获取http适配器
  app.useGlobalFilters(new AllExceptionFilter(new Logger(), httpAdapter));
  //pipe
  app.useGlobalPipes(new ValidationPipe());
  // app.use(
  //   session({
  //     //session配置
  //     name: 'jr.sid', //cookie名字
  //     secret: '5eyqj0IfoBUul9mDOtA2SEJGbh41g3KQ',
  //     rolling: true, //每次请求都重新设置cookie
  //     cookie: {
  //       maxAge: 1000 * 60 * 60 * 24 * 7, //过期时间
  //       httpOnly: true, //只允许后端修改
  //       sameSite: 'none', //跨域
  //       secure: true, //只允许https
  //     },
  //   }),
  // );
  //cookie
  app.use(cookieParser('5eyqj0IfoBUul9mDOtA2SEJGbh41g3KQ'));
  //限流
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000,
    }),
  );
  //helmet头部安全，防止xss攻击
  app.use(helmet());
  //winston打印端口
  const logger = new Logger();
  logger.log(`Listening at http://localhost:3000/api/v1`);
  await app.listen(3000);
}
bootstrap();
