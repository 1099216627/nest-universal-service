import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/users.entity';
import { GetUserDto } from './dto/get-user.dto';
import {
  generatePaginationData,
  getPageAndLimit,
  ResultData,
} from '../../common/utils';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleService: RolesService,
  ) {}

  async findAll(getUsersDto: GetUserDto): Promise<ResultData> {
    const { page, limit, gender, username, roleId } = getUsersDto;
    const { take, skip } = getPageAndLimit(page, limit);
    //find方法查询
    const [data, total] = await this.userRepository.findAndCount({
      relations: ['role', 'profile'],
      skip,
      take,
      where: {
        username: Like(username),
        profile: {
          gender,
        },
        role: {
          id: roleId,
        },
      },
    });
    const pagination = generatePaginationData(total, Number(page), limit);
    return ResultData.success('获取用户列表成功', { ...pagination, data });
  }

  async create(dto: Partial<CreateUserDto>): Promise<ResultData> {
    const { roleId, username, password } = dto;
    const user = await this.userRepository.create({ username, password });
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    const role = await this.roleService.findOne(roleId);
    if (role) {
      user.role = role;
    }
    const result = await this.userRepository.save(user);
    return ResultData.success('创建用户成功', result);
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'profile', 'role.menus', 'role.permissions'],
    });
  }

  async delete(id: number): Promise<User> {
    const user = await this.findOne(id);
    return await this.userRepository.remove(user);
  }

  async update(id: number, dto: CreateUserDto): Promise<UpdateResult> {
    const { roleId, username, password } = dto;
    const user = await this.userRepository.create({ username, password });
    const role = await this.roleService.findOne(roleId);
    const newUser = await this.userRepository.merge(user, { role });
    return await this.userRepository.update(id, newUser);
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  async findUserPermissions(id: number): Promise<Record<string, any>[]> {
    const user = await this.findOne(id);
    return user.role.menus.map((menu) => menu.permissions).flat();
  }
}
