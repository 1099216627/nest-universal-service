import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from './entities/logger.entity';
import { Repository } from 'typeorm';
import { CreateLogDto } from './dto/create-log.dto';
import { UsersService } from '../users/users.service';
import { GetLogsDto } from './dto/get-logs.dto';
import {
  generatePaginationData,
  getPageAndLimit,
  isVoid,
  ResultData,
} from '../../common/utils';
@Injectable()
export class LoggerService {
  constructor(
    @InjectRepository(Logger)
    private readonly logsRepository: Repository<Logger>,
    private readonly userService: UsersService,
  ) {}

  async findAll(query: GetLogsDto): Promise<ResultData> {
    const { page, limit } = query;
    const { skip, take } = getPageAndLimit(page, limit);
    const [data, total] = await this.logsRepository.findAndCount({
      skip,
      take,
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
    });
    const pagination = generatePaginationData(
      total,
      Number(page),
      Number(limit),
    );
    return ResultData.success('查询成功', { data, ...pagination });
  }

  async create(dto: CreateLogDto) {
    const { userId, method, time, path, ip, code, name } = dto;
    let user = null;
    if (!isVoid(userId)) {
      user = await this.userService.findOne(userId);
    }
    const log = await this.logsRepository.create({
      user,
      method,
      time,
      path,
      code,
      name,
      ip,
    });
    return await this.logsRepository.save(log);
  }
}
