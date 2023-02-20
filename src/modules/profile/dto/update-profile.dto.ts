import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { GenderEnum } from '../../../common/enum/config.enum';
import { ResultData } from '../../../common/utils';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty({ message: '昵称不能为空' })
  nickname: string;
  @IsEnum(GenderEnum, { message: '性别选择错误' })
  @IsNotEmpty({ message: '性别不能为空' })
  gender: GenderEnum;
  @IsString()
  @IsOptional()
  avatar: string;
  @IsString()
  @IsOptional()
  address: string;
  @IsNumber()
  @IsOptional()
  roleId:number;
}
