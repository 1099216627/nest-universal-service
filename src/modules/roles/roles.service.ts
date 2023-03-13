import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/roles.entity';
import { Like, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import {
  generatePaginationData,
  getPageAndLimit,
  ResultData,
} from '../../common/utils';
import { HttpCodeEnum } from '../../common/enum/http-code.enum';
import { MenuService } from '../menu/menu.service';
import { GetRoleDto } from './dto/get-role.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IsDefaultEnum, StatusEnum } from '../../common/enum/config.enum';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly menuService: MenuService,
  ) {}
  async findOne(condition: Record<string, any>): Promise<Role> {
    return await this.roleRepository.findOne({
      where: condition,
      relations: ['menus', 'permissions', 'users'],
    });
  }

  async updatePermission(
    id: number,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<ResultData> {
    const { permissions } = updatePermissionDto;
    const role = await this.findOne({ id });
    if (!role) {
      return ResultData.error(HttpCodeEnum.BAD_REQUEST, '角色不存在');
    }
    if (role.isDefault === IsDefaultEnum.YES) {
      return ResultData.error(
        HttpCodeEnum.BAD_REQUEST,
        '默认角色不允许修改权限',
      );
    }
    if (role.status === StatusEnum.LOCK) {
      return ResultData.error(
        HttpCodeEnum.BAD_REQUEST,
        '锁定角色不允许修改权限',
      );
    }
    const findPermissions = await this.menuService.findPermissionByIds(
      permissions,
    );

    role.permissions = findPermissions;
    await this.roleRepository.save(role);
    return ResultData.success('更新角色权限成功', role);
  }

  async find(): Promise<ResultData> {
    const data = await this.roleRepository.find();
    return ResultData.success('获取角色列表成功', data);
  }

  async findAll(query: GetRoleDto): Promise<ResultData> {
    const { page, limit = 20, name = '' } = query;
    const { skip, take } = getPageAndLimit(page, limit);
    const [data, total] = await this.roleRepository.findAndCount({
      where: {
        name: Like(`%${name}%`),
      },
      relations: ['users', 'menus', 'permissions'],
      skip,
      take,
      order: {
        createdAt: 'DESC',
      },
    });
    const pagination = generatePaginationData(
      total,
      Number(page),
      Number(limit),
    );
    return ResultData.success('获取角色列表成功', {
      list: data,
      ...pagination,
    });
  }

  async create(createRoleDto: CreateRoleDto): Promise<ResultData> {
    const { name, menus } = createRoleDto;
    const findRole = await this.findOne({ name });
    if (findRole) {
      return ResultData.error(HttpCodeEnum.BAD_REQUEST, '角色名称重复');
    }
    const role = await this.roleRepository.create({ name });
    const menuList = await this.menuService.findMenuByKeys(menus);
    const newRole = await this.roleRepository.merge(role, {
      menus: menuList,
    });
    await this.roleRepository.save(newRole);
    return ResultData.success('创建角色成功', newRole);
  }

  async update(id: number, updateRoleDto: CreateRoleDto): Promise<ResultData> {
    const { name, menus } = updateRoleDto;
    const role = await this.findOne({ id });
    if (!role) {
      return ResultData.error(HttpCodeEnum.BAD_REQUEST, '角色不存在');
    }
    if (role.isDefault === IsDefaultEnum.YES) {
      return ResultData.error(HttpCodeEnum.BAD_REQUEST, '默认角色不允许修改');
    }
    if (role.status === StatusEnum.LOCK) {
      return ResultData.error(HttpCodeEnum.BAD_REQUEST, '锁定角色不允许修改');
    }
    const menuList = await this.menuService.findMenuByKeys(menus);
    role.name = name;
    role.menus = menuList;
    await this.roleRepository.save(role);
    return ResultData.success('更新角色成功', role);
  }

  async delete(id: number): Promise<ResultData> {
    const role = await this.findOne({ id });
    if (!role) {
      return ResultData.error(HttpCodeEnum.BAD_REQUEST, '角色不存在');
    }
    if (role.isDefault === IsDefaultEnum.YES) {
      return ResultData.error(HttpCodeEnum.BAD_REQUEST, '默认角色不允许删除');
    }
    if (role.users.length > 0) {
      //开启事务
      const queryRunner =
        this.roleRepository.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      //角色下用户转移到用户角色
      const userRole = await this.roleRepository.findOne({
        where: {
          identification: 'user',
        },
      });
      if (!userRole) {
        return ResultData.error(HttpCodeEnum.BAD_REQUEST, '用户角色不存在');
      }
      role.users.forEach(async (user) => {
        user.role = userRole;
        await queryRunner.manager.save(user);
      });
      try {
        await queryRunner.manager.remove(role);
        await queryRunner.commitTransaction();
        return ResultData.success('删除角色成功');
      } catch (err) {
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    } else {
      await this.roleRepository.remove(role);
      return ResultData.success('删除角色成功');
    }
  }

  async lock(id: number): Promise<ResultData> {
    const role = await this.findOne({ id });
    if (!role) {
      return ResultData.error(HttpCodeEnum.BAD_REQUEST, '角色不存在');
    }
    if (role.isDefault === IsDefaultEnum.YES) {
      return ResultData.error(HttpCodeEnum.BAD_REQUEST, '默认角色不允许锁定');
    }
    role.status = StatusEnum.LOCK;
    await this.roleRepository.save(role);
    return ResultData.success('锁定角色成功', role);
  }

  async unlock(id: number): Promise<ResultData> {
    const role = await this.findOne({ id });
    if (!role) {
      return ResultData.error(HttpCodeEnum.BAD_REQUEST, '角色不存在');
    }
    if (role.isDefault === IsDefaultEnum.YES) {
      return ResultData.error(HttpCodeEnum.BAD_REQUEST, '默认角色不允许解锁');
    }
    role.status = StatusEnum.ENABLED;
    await this.roleRepository.save(role);
    return ResultData.success('解锁角色成功', role);
  }
}
