import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslService } from '../modules/auth/casl.service';
import {
  CaslType,
  CHECK_POLICIES_KEY,
  policyHandlerCallback,
} from '../decorators/casl.decorator';
import { is } from '../common/utils/index';

function isFunction(fn: any) {
  return is(fn, 'Function');
}

function isArray(arr: any) {
  return is(arr, 'Array');
}

@Injectable()
export class CaslGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly caslService: CaslService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handlers = this.reflector.getAllAndMerge<policyHandlerCallback[]>(
      CHECK_POLICIES_KEY.HANDLER,
      [context.getClass(), context.getHandler()],
    );

    const canHandlers = this.reflector.getAllAndMerge<any[]>(
      CHECK_POLICIES_KEY.CAN,
      [context.getClass(), context.getHandler()],
    ) as CaslType;

    const cannotHandlers = this.reflector.getAllAndMerge<any[]>(
      CHECK_POLICIES_KEY.CANNOT,
      [context.getClass(), context.getHandler()],
    ) as CaslType;
    let flag = true;

    // 如果没有设置权限检查，直接放行
    if (!handlers && !canHandlers && !cannotHandlers) {
      return flag;
    }
    const ctx = context.switchToHttp().getRequest();

    if (ctx.user) {
      const ability = await this.caslService.forRoot(ctx.user.id);
      //当设置了权限检查时，检查权限并返回结果
      if (handlers && handlers.length > 0) {
        flag = flag && handlers.every((handler) => handler(ability));
      }
      if (
        flag &&
        canHandlers &&
        (isFunction(canHandlers) ||
          (isArray(canHandlers) && canHandlers.length > 0))
      ) {
        if (Array.isArray(canHandlers)) {
          flag = flag && canHandlers.every((handler) => handler(ability));
        } else {
          flag = flag && canHandlers(ability);
        }
      }
      if (
        flag &&
        cannotHandlers &&
        (isFunction(cannotHandlers) ||
          (isArray(cannotHandlers) && cannotHandlers.length > 0))
      ) {
        if (Array.isArray(canHandlers)) {
          flag = flag && canHandlers.every((handler) => handler(ability));
        } else {
          flag = flag && canHandlers(ability);
        }
      }
      return flag;
    } else {
      return false;
    }
  }
}
