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
import { UserAction } from '../../common/enum/action.enum';
import { User } from './entities/users.entity';
import { setRouteNameDecorator } from '../../decorators/set-route-name.decorator';
import { GetUser } from 'src/decorators/get-user.decorator';

@Controller('user')
@UseGuards(JwtGuard, CaslGuard)
@UseInterceptors(ClassSerializerInterceptor, LoggerInterceptor)
export class UsersController {
  constructor(
    private configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  @Get('list')
  @Can(UserAction.EXPORT, User)
  @setRouteNameDecorator('导出用户列表')
  async getUserListByIds(@Query('ids') ids): Promise<ResultData> {
    return await this.userService.getList(ids);
  }

  //获取所有用户
  @Get()
  @Can(UserAction.READ, User)
  @setRouteNameDecorator('查询所有用户')
  async getAllUsers(@Query() getUsersDto: GetUserDto,@GetUser() user): Promise<ResultData> {
    return await this.userService.findAll(getUsersDto,user);
  }

  @Can(UserAction.READ, User)
  @setRouteNameDecorator('查询用户详情')
  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ResultData> {
    const result = await this.userService.findOne(id);
    return ResultData.success('查询用户信息成功', result);
  }

  //创建用户
  @Post()
  @Can(UserAction.CREATE, User)
  @setRouteNameDecorator('创建用户')
  async createUser(@Body() dto: CreateUserDto): Promise<ResultData> {
    return await this.userService.create(dto);
  }

  @Delete('batch')
  @Can(UserAction.DELETE, User)
  @setRouteNameDecorator('批量删除用户')
  async delete(@Body() batchDeleteDto: BatchDeleteDto): Promise<ResultData> {
    return await this.userService.batchDelete(batchDeleteDto);
  }

  //删除用户
  @Delete('/:id')
  @Can(UserAction.DELETE, User)
  @setRouteNameDecorator('删除用户')
  async deleteUser(@Param('id') id: number): Promise<ResultData> {
    return await this.userService.delete(id);
  }

  @Put('disable/:id')
  @Can(UserAction.STATUS, User)
  @setRouteNameDecorator('禁用用户')
  async disableUser(@Param('id') id: number): Promise<ResultData> {
    return await this.userService.disableUser(id);
  }

  @Put('enable/:id')
  @Can(UserAction.STATUS, User)
  @setRouteNameDecorator('启用用户')
  async enableUser(@Param('id') id: number): Promise<ResultData> {
    return await this.userService.enableUser(id);
  }

  @Put('recover/:id')
  @Can(UserAction.STATUS, User)
  @setRouteNameDecorator('恢复用户')
  async recoverUser(@Param('id') id: number): Promise<ResultData> {
    return await this.userService.recoverUser(id);
  }
}
