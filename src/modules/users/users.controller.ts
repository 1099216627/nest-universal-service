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

@Controller('user')
@UseGuards(JwtGuard)
@UseInterceptors(ClassSerializerInterceptor, LoggerInterceptor)
export class UsersController {
  constructor(
    private configService: ConfigService,
    private readonly userService: UsersService,
  ) {}
  //获取所有用户
  @Get()
  async getAllUsers(@Query() getUsersDto: GetUserDto): Promise<ResultData> {
    return await this.userService.findAll(getUsersDto);
  }
  //创建用户
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<ResultData> {
    return await this.userService.create(dto);
  }

  @Delete('batch')
  async delete(@Body() batchDeleteDto: BatchDeleteDto): Promise<ResultData> {
    return await this.userService.batchDelete(batchDeleteDto);
  }

  //删除用户
  @Delete('/:id')
  async deleteUser(@Param('id') id: number): Promise<ResultData> {
    return await this.userService.delete(id);
  }

  //更新用户
  @Put('/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateUserDto>,
  ): Promise<any> {
    return await this.userService.update(id, dto);
  }
}
