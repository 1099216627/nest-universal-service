import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SigninUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 20, {
    message: '用户名长度必须在6-20之间',
  })
  username: string;

  sevenDays: boolean;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20, {
    message: '密码长度必须在6-20位之间',
  })
  password: string;

  @IsNotEmpty({ message: '验证码不能为空' })
  code: string;

  @IsNotEmpty({ message: '验证码id不能为空' })
  codeId: string;
}
