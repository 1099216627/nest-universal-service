import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
  roleId: number;
  nickname: string;
  avatar: string;
  gender: number;
}
