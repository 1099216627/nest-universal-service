import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateLogDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  path: string;

  @IsString()
  @IsNotEmpty()
  method: string;

  @IsString()
  @IsNotEmpty()
  ip: string;

  @IsNumber()
  @IsNotEmpty()
  time: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  code: number;

  @IsNotEmpty()
  area: string;
}
