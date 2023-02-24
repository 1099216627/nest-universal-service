import { IsNotEmpty, IsString } from 'class-validator';

export class CreateResourceDto {
  @IsNotEmpty({ message: '资源名称不能为空' })
  @IsString({ message: '资源名称必须为字符串' })
  name: string;
  @IsNotEmpty({ message: '资源描述不能为空' })
  @IsString({ message: '资源描述必须为字符串' })
  description: string;
  @IsNotEmpty({ message: '资源链接不能为空' })
  @IsString({ message: '资源链接必须为字符串' })
  url: string;
  @IsNotEmpty({ message: '资源封面不能为空' })
  @IsString({ message: '资源封面必须为字符串' })
  cover: string;
}
