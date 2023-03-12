import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty({ message: '用户角色不能为空' })
  @IsNumber({}, { message: '用户id必须为数字' })
  roleId: number;
  @IsNotEmpty({ message: '用户昵称不能为空' })
  nickname: string;
  @IsNotEmpty({ message: '用户头像不能为空' })
  avatar: string;
  @IsNotEmpty({ message: '用户性别不能为空' })
  gender: number;
}
