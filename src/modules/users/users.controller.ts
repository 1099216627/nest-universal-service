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
  Response,
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
import { UpdateUserDto } from './dto/update-user.dto';
import xlsx from 'node-xlsx';
import { AccountStatusEnum, GenderEnum } from 'src/common/enum/config.enum';

@Controller('user')
@UseGuards(JwtGuard, CaslGuard)
@UseInterceptors(ClassSerializerInterceptor, LoggerInterceptor)
export class UsersController {
  constructor(
    private configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  @Post('export')
  @Can(UserAction.EXPORT, User)
  @setRouteNameDecorator('导出用户列表')
  async getUserListByIds(@Body() dto: { ids: number[] }, @Response() res) {
    //获取用户列表并导出excel
    const userList: User[] = await this.userService.getList(dto.ids);
    const titles = [
      '用户名',
      '性别',
      '角色',
      '昵称',
      '邮箱',
      '手机号',
      '地址',
      '状态',
      '注册时间',
    ];
    const data = userList.map((item) => {
      return [
        item.username,
        item.profile.gender === GenderEnum.FEMALE ? '女' : '男',
        item.role.name,
        item.profile.nickname,
        item.profile.email,
        item.profile.phone,
        item.profile.address,
        item.status === AccountStatusEnum.ENABLED
          ? '正常'
          : item.status === AccountStatusEnum.DISABLE
          ? '禁用'
          : '删除',
        item.createdAt,
      ];
    });
    const options = {
      '!cols': [
        { wch: 20 },
        { wch: 10 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
      ],
    };
    const buffer = xlsx.build([
      { name: '用户列表', data: [titles, ...data], options },
    ]);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + encodeURIComponent('用户列表.xlsx'),
    );
    res.end(buffer, 'binary');
  }

  //获取所有用户
  @Get()
  @Can(UserAction.READ, User)
  @setRouteNameDecorator('查询用户列表')
  async getUserList(
    @Query() getUsersDto: GetUserDto,
    @GetUser() user,
  ): Promise<ResultData> {
    return await this.userService.findAll(getUsersDto, user);
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
  //编辑用户
  @Put(':id')
  @Can(UserAction.UPDATE, User)
  @setRouteNameDecorator('编辑用户')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(id, updateUserDto);
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
