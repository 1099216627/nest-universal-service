import { IsArray, IsNotEmpty } from 'class-validator';

export class BatchDeleteDto {
  @IsArray()
  @IsNotEmpty({ message: 'id集合不能为空' })
  ids: number[];
}
