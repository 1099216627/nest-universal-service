import { HttpCodeEnum } from './../../common/enum/http-code.enum';
import { GetListDto } from './dto/get-list.dto';
import { generatePaginationData, getPageAndLimit, ResultData } from './../../common/utils/index';
import { Resource } from './entities/resource.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Repository, Like } from 'typeorm';

@Injectable()
export class ResourcesService {
  constructor(@InjectRepository(Resource) private readonly resourceRespository:Repository<Resource>) {}
  async create(createResourceDto: CreateResourceDto):Promise<ResultData> {
    const resource = await this.resourceRespository.create(createResourceDto);
    await this.resourceRespository.save(resource);
    return ResultData.success("创建成功",resource);
  }

  async getList(query:GetListDto):Promise<ResultData> {
    const {page,limit,name = ''} = query;
    const { take, skip } = getPageAndLimit(page, limit);
    const [list, total] = await this.resourceRespository.findAndCount({
      where: {
        name: Like(`%${name}%`),
      },
      take,
      skip,
    });
    const paginationData = generatePaginationData(total,Number(page),Number(limit));
    return ResultData.success("获取成功",{list,...paginationData});
  }

  async update(id: number, updateResourceDto: UpdateResourceDto):Promise<ResultData> {
    const resource = await this.resourceRespository.findOne({where:{id}});
    if(!resource) {
      return ResultData.error(HttpCodeEnum.BAD_REQUEST,"资源不存在");
    }
    await this.resourceRespository.update(id,updateResourceDto);
    return ResultData.success("更新资源成功");
  }

  async remove(id: number):Promise<ResultData> {
    const resource = await this.resourceRespository.findOne({where:{id}});
    if(!resource) {
      return ResultData.error(HttpCodeEnum.BAD_REQUEST,"资源不存在");
    }
    await this.resourceRespository.delete(id);
    return ResultData.success("删除资源成功");
  }
}
