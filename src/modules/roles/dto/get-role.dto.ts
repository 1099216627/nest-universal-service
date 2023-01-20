import { IsNotEmpty } from 'class-validator';

export class GetRoleDto {
  @IsNotEmpty({ message: '页码不能为空' })
  page: number;
  limit?: number;
  name?: string;
}
