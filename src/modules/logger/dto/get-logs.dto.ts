import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetLogsDto {
  @IsNotEmpty({ message: '页码不能为空' })
  page: number;

  @IsOptional()
  limit?: number;
}
