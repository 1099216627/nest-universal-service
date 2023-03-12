import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { isVoid, ResultData } from '../../common/utils';
import { HttpCodeEnum } from '../../common/enum/http-code.enum';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    @Inject(forwardRef(() => RolesService)) private rolesService: RolesService,
  ) {}

  async create() {
    return this.profileRepository.create();
  }

  async findOne(id: number) {
    return await this.profileRepository.findOne({
      where: {
        user: {
          id,
        },
      },
    });
  }

  async findOneByNickname(nickname: string) {
    return await this.profileRepository.findOne({
      where: {
        nickname,
      },
      relations: ['user'],
    });
  }

  async update(
    id: number,
    updateProfileDto: UpdateProfileDto,
  ): Promise<ResultData> {
    const { nickname, address, avatar, gender, phone, email } =
      updateProfileDto;
    const user = await this.usersService.findOne(id);
    if (!user) {
      return ResultData.error(HttpCodeEnum.NOT_FOUND, '用户不存在');
    }
    if (!isVoid(nickname)) {
      const profile = await this.findOneByNickname(nickname);
      if (profile && profile.user.id != id) {
        return ResultData.error(HttpCodeEnum.BAD_REQUEST, '昵称已存在');
      }
    }
    await this.profileRepository.merge(user.profile, {
      nickname,
      address,
      avatar,
      gender,
      email,
      phone,
    });
    //保存user
    const newUser = await this.usersService.save(user);
    return ResultData.success('更新用户信息成功', newUser);
  }
}
