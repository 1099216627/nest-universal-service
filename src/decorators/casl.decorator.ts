import {
  UserAction,
  RoleAction,
  LogAction,
  ResourceAction,
} from './../common/enum/action.enum';
import { AnyMongoAbility, InferSubjects } from '@casl/ability';
import { SetMetadata } from '@nestjs/common';

export enum CHECK_POLICIES_KEY {
  HANDLER = 'CHECK_POLICIES_HANDLER',
  CAN = 'CHECK_POLICIES_CAN',
  CANNOT = 'CHECK_POLICIES_CANNOT',
}
export type policyHandlerCallback = (ability: AnyMongoAbility) => boolean;
export type CaslType = policyHandlerCallback | policyHandlerCallback[];

/**
 * @description: 用于检查权限的装饰器
 * @param handlers
 * @constructor
 * @example
 * @CheckPolicies((ability) => ability.can('read', 'Post'))
 */
export const CheckPolicies = (...handlers: policyHandlerCallback[]) =>
  SetMetadata(CHECK_POLICIES_KEY.HANDLER, handlers);

/**
 *
 * @param action 动作
 * @param subject 主体
 * @param conditions 条件
 * @constructor
 * @example id为1的用户可以删除id为1的日志
 * @Can(ActionEnum.DELETE, Log, 'id')
 */
export const Can = (
  action: UserAction | RoleAction | LogAction | ResourceAction,
  subject: InferSubjects<any>,
  conditions?: any,
) =>
  SetMetadata(CHECK_POLICIES_KEY.CAN, (ability: AnyMongoAbility) =>
    ability.can(action, subject, conditions),
  );

/**
 *
 * @param action 动作
 * @param subject 主体
 * @param conditions 条件
 * @constructor
 * @example
 * @Cannot(ActionEnum.READ, 'Post')
 */
export const Cannot = (
  action: UserAction | RoleAction | LogAction | ResourceAction,
  subject: InferSubjects<any>,
  conditions?: any,
) =>
  SetMetadata(CHECK_POLICIES_KEY.CANNOT, (ability: AnyMongoAbility) =>
    ability.cannot(action, subject, conditions),
  );
