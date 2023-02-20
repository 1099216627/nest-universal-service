import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
  @IsOptional()
  roleId: number;
  @IsOptional()
  nickname: string;
  @IsOptional()
  avatar: string;
  @IsOptional()
  gender: number;
}
