import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetUserDto {
  @IsNotEmpty({ message: '页码不能为空' })
  page: number;
  @IsOptional()
  limit?: number;
  @IsOptional()
  username?: string;
  @IsOptional()
  roleId?: number;
  @IsOptional()
  gender?: number;
  @IsOptional()
  status?: number;
}
