import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
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
}
