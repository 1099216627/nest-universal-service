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

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly menuService: MenuService,
  ) {}
  async findOne(condition: number | string): Promise<Role> {
    let where = {};
    if (typeof condition === 'number') {
      where = { id: condition };
    } else if (typeof condition === 'string') {
      where = { name: condition };
    }
    return await this.roleRepository.findOne({ where });
  }

  async findAll(query: GetRoleDto): Promise<ResultData> {
    const { page, limit = 10, name = '' } = query;
    const { skip, take } = getPageAndLimit(page, limit);
    const [data, total] = await this.roleRepository.findAndCount({
      where: {
        name: Like(`%${name}%`),
      },
      skip,
      take,
    });
    const pagination = generatePaginationData(
      total,
      Number(page),
      Number(limit),
    );
    return ResultData.success('获取角色列表成功', { data, ...pagination });
  }

  async create(createRoleDto: CreateRoleDto): Promise<ResultData> {
    const { name, menus } = createRoleDto;
    const findRole = await this.findOne(name);
    if (findRole) {
      return ResultData.error(HttpCodeEnum.BAD_REQUEST, '角色名称重复');
    }
    const role = await this.roleRepository.create({ name });
    const menuList = await this.menuService.findMenuByKeys(menus);
    const newRole = await this.roleRepository.merge(role, { menus: menuList });
    await this.roleRepository.save(newRole);
    return ResultData.success('创建角色成功', newRole);
  }
}
