import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { GetUserDto } from './dto/get-user.dto';
import {
  generatePaginationData,
  getPageAndLimit,
  isVoid,
  randomNickname,
  ResultData,
} from '../../common/utils';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import * as bcrypt from 'bcrypt';
import { ProfileService } from '../profile/profile.service';
import { HttpCodeEnum } from '../../common/enum/http-code.enum';
import { AccountStatusEnum } from '../../common/enum/config.enum';
import { BatchDeleteDto } from './dto/batch-delete.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleService: RolesService,
    private readonly profileService: ProfileService,
  ) {}

  async findAll(getUsersDto: GetUserDto): Promise<ResultData> {
    const { page, limit, gender, username = '', roleId } = getUsersDto;
    const { take, skip } = getPageAndLimit(page, limit);
    //find方法查询
    const [data, total] = await this.userRepository.findAndCount({
      relations: ['role', 'profile'],
      skip,
      take,
      where: {
        username: Like(`%${username}%`),
        status: Not(AccountStatusEnum.DELETE),
        profile: {
          gender,
        },
        role: {
          id: roleId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
    const pagination = generatePaginationData(
      total,
      Number(page),
      Number(limit),
    );
    return ResultData.success('获取用户列表成功', { ...pagination, data });
  }

  async create(dto: Partial<CreateUserDto>): Promise<ResultData> {
    const { roleId, username, password, nickname, avatar, gender } = dto;
    const findUser = await this.userRepository.findOne({ where: { username } });
    if (findUser) {
      return ResultData.error(HttpCodeEnum.BAD_REQUEST, '用户名已存在');
    }
    const user = await this.userRepository.create({ username, password });
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    const role = await this.roleService.findOne(roleId);
    user.profile = await this.profileService.create();
    if (role) {
      user.role = role;
    }
    if (!isVoid(nickname)) {
      user.profile.nickname = nickname;
    } else {
      user.profile.nickname = randomNickname();
    }
    if (!isVoid(avatar)) {
      user.profile.avatar = avatar;
    }
    if (!isVoid(gender)) {
      user.profile.gender = gender;
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

  async delete(id: number): Promise<ResultData> {
    const user = await this.findOne(id);
    user.status = AccountStatusEnum.DELETE;
    await this.userRepository.save(user);
    return ResultData.success('删除用户成功');
  }

  async batchDelete(batchDeleteDto: BatchDeleteDto): Promise<ResultData> {
    const { ids } = batchDeleteDto;
    await this.userRepository.update(ids, { status: AccountStatusEnum.DELETE });
    return ResultData.success('批量删除成功');
  }

  async update(id: number, dto: Partial<CreateUserDto>): Promise<ResultData> {
    const { roleId, username, nickname, gender, avatar } = dto;
    const user = await this.findOne(id);
    if (!user) {
      return ResultData.error(HttpCodeEnum.BAD_REQUEST, '用户不存在');
    }
    if (user.username !== username) {
      const findUser = await this.findOneByUsername(username);
      if (findUser) {
        return ResultData.error(HttpCodeEnum.BAD_REQUEST, '用户名已存在');
      }
    }
    user.role = await this.roleService.findOne(roleId);
    user.username = username;
    if (nickname) {
      user.profile.nickname = nickname;
    }
    if (gender) {
      user.profile.gender = gender;
    }
    if (avatar) {
      user.profile.avatar = avatar;
    }
    await this.userRepository.save(user);
    return ResultData.success('更新用户成功', user);
  }

  async findOneByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        username,
      },
      relations: ['role', 'profile'],
    });
  }

  async findUserPermissions(id: number): Promise<Record<string, any>[]> {
    const user = await this.findOne(id);
    return user.role.permissions;
  }
}
