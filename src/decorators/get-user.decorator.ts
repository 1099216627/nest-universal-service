import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// JWTGuard守卫下直接获取用户信息
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
