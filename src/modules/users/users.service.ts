import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Not, Repository } from 'typeorm';
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
import {
  AccountStatusEnum,
  IsDefaultEnum,
} from '../../common/enum/config.enum';
import { BatchDeleteDto } from './dto/batch-delete.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly roleService: RolesService,
    private readonly profileService: ProfileService,
  ) {}

  async findAll(getUsersDto: GetUserDto, user): Promise<ResultData> {
    const { page, limit, gender, name = '', roleId, status } = getUsersDto;
    const { take, skip } = getPageAndLimit(page, limit);
    const id = user.id;
    const builder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.id != :id', { id });
    if (!isVoid(status)) {
      builder.andWhere('user.status = :status', { status });
    }
    if (!isVoid(name)) {
      builder.andWhere(
        'user.username like :name or profile.nickname like :name',
        { name: `%${name}%` },
      );
    }
    if (!isVoid(roleId)) {
      builder.andWhere('role.id = :roleId', { roleId });
    }
    if (!isVoid(gender)) {
      builder.andWhere('profile.gender = :gender', { gender });
    }
    builder.orderBy('user.createdAt', 'DESC');
    const [data, total] = await builder.take(take).skip(skip).getManyAndCount();

    const pagination = generatePaginationData(
      total,
      Number(page),
      Number(limit),
    );
    return ResultData.success('获取用户列表成功', {
      ...pagination,
      list: data,
    });
  }

  async create(dto: Partial<CreateUserDto>): Promise<ResultData> {
    const { roleId, username, password, nickname, avatar, gender } = dto;
    const findUser = await this.userRepository.findOne({ where: { username } });
    if (findUser) {
      return ResultData.error(
        HttpCodeEnum.BAD_REQUEST,
        '用户名已存在，请直接前往登录',
      );
    }
    if (!isVoid(nickname)) {
      const findProfile = await this.profileService.findOneByNickname(nickname);
      if (findProfile) {
        return ResultData.error(HttpCodeEnum.BAD_REQUEST, '昵称已存在');
      }
    }
    const user = await this.userRepository.create({ username, password });
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    //identification: 'user' 为默认角色
    const role = await this.roleService.findOne(
      roleId ? { id: roleId } : { identification: 'user' },
    );
    user.profile = await this.profileService.create();
    if (!role) {
      return ResultData.error(HttpCodeEnum.NOT_FOUND, '角色不存在');
    }
    if (role.status === 0 && role.isDefault !== IsDefaultEnum.YES) {
      return ResultData.error(
        HttpCodeEnum.BAD_REQUEST,
        '角色已锁定，无法分配角色',
      );
    }
    user.role = role;
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

  async update(id: number, updateUserDto: UpdateUserDto): Promise<ResultData> {
    const { gender, avatar, roleId, nickname } = updateUserDto;
    const findUser = await this.findOne(id);
    if (!findUser) {
      return ResultData.error(HttpCodeEnum.NOT_FOUND, '编辑用户不存在');
    }
    const findRole = await this.roleService.findOne({ id: roleId });
    if (!findRole) {
      return ResultData.error(HttpCodeEnum.NOT_FOUND, '所选角色不存在');
    }
    if (findRole.status === 0 && findRole.isDefault !== IsDefaultEnum.YES) {
      return ResultData.error(
        HttpCodeEnum.BAD_REQUEST,
        '所选角色已锁定，无法分配角色',
      );
    }
    findUser.profile.gender = gender;
    findUser.profile.avatar = avatar;
    findUser.profile.nickname = nickname;
    findUser.role = findRole;
    await this.userRepository.save(findUser);
    return ResultData.success('编辑用户成功', findUser);
  }

  async getList(ids: number[]): Promise<User[]> {
    return await this.userRepository.find({
      where: {
        id: In(ids),
      },
      relations: ['role', 'profile', 'role.menus', 'role.permissions'],
    });
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['role', 'profile', 'role.menus', 'role.permissions'],
    });
  }

  async findUserPassword(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
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

  async disableUser(id: number): Promise<ResultData> {
    const user = await this.findOne(id);
    user.status = AccountStatusEnum.DISABLE;
    await this.userRepository.save(user);
    return ResultData.success('禁用用户成功');
  }

  async enableUser(id: number): Promise<ResultData> {
    const user = await this.findOne(id);
    user.status = AccountStatusEnum.ENABLED;
    await this.userRepository.save(user);
    return ResultData.success('启用用户成功');
  }

  async recoverUser(id: number): Promise<ResultData> {
    const user = await this.findOne(id);
    user.status = AccountStatusEnum.ENABLED;
    await this.userRepository.save(user);
    return ResultData.success('恢复用户成功');
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

  async save(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async updater(id: number, params: Partial<User>) {
    return await this.userRepository.update(id, params);
  }
}
