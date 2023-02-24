import { IsArray, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: '角色名称不能为空' })
  @IsString()
  @Length(2, 20, { message: '角色名称为2-20个字' })
  name: string;

  @IsNotEmpty({ message: '角色菜单不能为空' })
  @IsArray()
  menus: string[];
}
