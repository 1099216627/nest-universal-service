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
    @InjectRepository(Permission)
    private readonly perRepository: Repository<Permission>,
  ) {}

  async findAll(): Promise<ResultData> {
    const result = await this.menuRepository.find();
    return ResultData.success('获取菜单列表成功', result);
  }

  async findAllPermission(): Promise<ResultData> {
    const result = await this.perRepository.find();
    return ResultData.success('获取权限列表成功', result);
  }

  async findUserMenus(req): Promise<ResultData> {
    const role = req.user.role;
    const menus = await this.menuRepository.find({
      where: {
        roles: {
          id: role.id,
        },
      },
    });
    const permissions = await this.perRepository.find({
      where: {
        roles: {
          id: role.id,
        },
      },
    });
    return ResultData.success('获取用户菜单成功', { permissions, menus });
  }

  async findMenuByKeys(ids: number[]): Promise<Menu[]> {
    return await this.menuRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  async findPermissionByIds(ids: number[]): Promise<Permission[]> {
    return await this.perRepository.find({
      where: {
        id: In(ids),
      },
    });
  }
}
