import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { In, Repository } from 'typeorm';
import { ResultData } from '../../common/utils';
import { Permission } from './entities/permission.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
  ) {}

  async findAll(): Promise<ResultData> {
    const result = await this.menuRepository.find({
      relations: ['permissions'],
    });
    return ResultData.success('获取菜单列表成功', result);
  }

  async findUserMenus(req): Promise<ResultData> {
    const role = req.user.role;
    const result = await this.menuRepository.find({
      relations: ['permissions'],
      where: {
        roles: {
          id: role.id,
        },
      },
    });
    const permissions = result.map((item) => item.permissions).flat();
    const menus = result.map((item) => {
      delete item.permissions;
      return item;
    });
    return ResultData.success('获取用户菜单成功', { permissions, menus });
  }

  async findMenuByKeys(keys: string[]): Promise<Menu[]> {
    return await this.menuRepository
      .createQueryBuilder('menu')
      .where('menu.key IN (:...keys)', { keys })
      .leftJoinAndSelect(
        'menu.permissions',
        'permissions',
        'permissions.key In (:...keys)',
        { keys },
      )
      .getMany();
  }
}
