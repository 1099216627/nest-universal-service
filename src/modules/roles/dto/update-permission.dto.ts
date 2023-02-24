import { IsArray, IsNotEmpty } from 'class-validator';

export class UpdatePermissionDto {
  @IsNotEmpty({ message: '角色权限不能为空' })
  @IsArray({ message: '角色权限必须为数组' })
  permissions: string[];
}
