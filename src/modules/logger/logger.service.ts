import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from './entities/logger.entity';
import { Between, Repository } from 'typeorm';
import { CreateLogDto } from './dto/create-log.dto';
import { UsersService } from '../users/users.service';
import { GetLogsDto } from './dto/get-logs.dto';
import {
  generatePaginationData,
  getPageAndLimit,
  isVoid,
  ResultData,
} from '../../common/utils';
import { DeleteLogDto } from './dto/delete-log.dto';
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
    return ResultData.success('查询成功', { list: data, ...pagination });
  }

  async deleteAll(): Promise<ResultData> {
    await this.logsRepository.clear();
    return ResultData.success('删除成功');
  }

  async deleteByTime(deleteLogDto: DeleteLogDto): Promise<ResultData> {
    const { start, end } = deleteLogDto;
    const startTime = new Date(start);
    const endTime = new Date(end);
    await this.logsRepository.delete({
      createdAt: Between(startTime, endTime),
    });
    return ResultData.success('删除成功');
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
