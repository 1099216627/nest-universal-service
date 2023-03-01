import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {
  @IsString({message: '旧密码必须为字符串'})
  @IsNotEmpty({message: '旧密码不能为空'})
  oldPassword: string;

  @IsString({message: '新密码必须为字符串'})
  @IsNotEmpty({message: '新密码不能为空'})
  newPassword: string;
}