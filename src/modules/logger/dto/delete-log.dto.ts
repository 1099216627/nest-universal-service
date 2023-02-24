import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteLogDto {
  @IsNumber()
  @IsNotEmpty({ message: '开始时间不能为空' })
  start: number;
  @IsNumber()
  @IsNotEmpty({ message: '结束时间不能为空' })
  end: number;
}
