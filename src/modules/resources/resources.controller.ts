import { ResultData } from './../../common/utils/index';
import { LoggerInterceptor } from './../../interceptors/logger.interceptor';
import { CaslGuard } from './../../guards/casl.guard';
import { JwtGuard } from './../../guards/jwt.guard';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Query, Put, ParseIntPipe } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { setRouteNameDecorator } from 'src/decorators/set-route-name.decorator';
import { GetListDto } from './dto/get-list.dto';

@Controller('resources')
@UseGuards(JwtGuard,CaslGuard)
@UseInterceptors(LoggerInterceptor)
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get()
  @setRouteNameDecorator('获取资源列表')
  async getList(@Query() query:GetListDto):Promise<ResultData> {
    return this.resourcesService.getList(query);
  }

  @Post()
  @setRouteNameDecorator('创建资源')
  async create(@Body() createResourceDto: CreateResourceDto):Promise<ResultData> {
    return this.resourcesService.create(createResourceDto);
  }

  @Put(':id')
  @setRouteNameDecorator('更新资源')
  async update(@Param('id',ParseIntPipe) id: number, @Body() updateResourceDto: CreateResourceDto):Promise<ResultData> {
    return this.resourcesService.update(id,updateResourceDto);
  }

  @Delete(':id')
  @setRouteNameDecorator('删除资源')
  async remove(@Param('id',ParseIntPipe) id: number):Promise<ResultData> {
    return this.resourcesService.remove(id);
  }
}
