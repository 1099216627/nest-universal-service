import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { GetUserDto } from './dto/get-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtGuard } from '../../guards/jwt.guard';
import { ResultData } from '../../common/utils';
import { LoggerInterceptor } from '../../interceptors/logger.interceptor';
import { BatchDeleteDto } from './dto/batch-delete.dto';
import { CaslGuard } from '../../guards/casl.guard';
import { Can } from '../../decorators/casl.decorator';
import { ActionEnum } from '../../common/enum/action.enum';
import { User } from './entities/users.entity';
import { setRouteNameDecorator } from '../../decorators/set-route-name.decorator';

@Controller('user')
@UseGuards(JwtGuard, CaslGuard)
@UseInterceptors(ClassSerializerInterceptor, LoggerInterceptor)
export class UsersController {
  constructor(
    private configService: ConfigService,
    private readonly userService: UsersService,
  ) {}
  //获取所有用户
  @Get()
  @Can(ActionEnum.READ, User)
  @setRouteNameDecorator('查询所有用户')
  async getAllUsers(@Query() getUsersDto: GetUserDto): Promise<ResultData> {
    return await this.userService.findAll(getUsersDto);
  }
  //创建用户
  @Post()
  @Can(ActionEnum.CREATE, User)
  @setRouteNameDecorator('创建用户')
  async createUser(@Body() dto: CreateUserDto): Promise<ResultData> {
    return await this.userService.create(dto);
  }

  @Delete('batch')
  @Can(ActionEnum.DELETE, User)
  @setRouteNameDecorator('批量删除用户')
  async delete(@Body() batchDeleteDto: BatchDeleteDto): Promise<ResultData> {
    return await this.userService.batchDelete(batchDeleteDto);
  }

  //删除用户
  @Delete('/:id')
  @Can(ActionEnum.DELETE, User)
  @setRouteNameDecorator('删除用户')
  async deleteUser(@Param('id') id: number): Promise<ResultData> {
    return await this.userService.delete(id);
  }

  @Put('disable/:id')
  @Can(ActionEnum.UPDATE, User)
  @setRouteNameDecorator('禁用用户')
  async disableUser(@Param('id') id: number): Promise<ResultData> {
    return await this.userService.disableUser(id);
  }

  @Put('enable/:id')
  @Can(ActionEnum.UPDATE, User)
  @setRouteNameDecorator('启用用户')
  async enableUser(@Param('id') id: number): Promise<ResultData> {
    return await this.userService.enableUser(id);
  }

  //更新用户
  @Put('/:id')
  @Can(ActionEnum.UPDATE, User)
  @setRouteNameDecorator('更新用户')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateUserDto>,
  ): Promise<any> {
    return await this.userService.update(id, dto);
  }
}
