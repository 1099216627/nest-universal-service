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
import { User } from './entities/users.entity';
import { GetUserDto } from './dto/get-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateResult } from 'typeorm';
import { JwtGuard } from '../../guards/jwt.guard';
import { ResultData } from '../../common/utils';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(
    private configService: ConfigService,
    private readonly userService: UsersService,
  ) {}
  //获取所有用户
  @UseGuards(JwtGuard)
  @Get()
  async getAllUsers(@Query() getUsersDto: GetUserDto): Promise<ResultData> {
    return await this.userService.findAll(getUsersDto);
  }
  //创建用户
  @UseGuards(JwtGuard)
  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<ResultData> {
    return await this.userService.create(dto);
  }
  //删除用户
  @UseGuards(JwtGuard)
  @Delete('/:id')
  async deleteUser(@Param('id') id: number): Promise<User> {
    return await this.userService.delete(id);
  }
  //更新用户
  @UseGuards(JwtGuard)
  @Put('/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() dto: CreateUserDto,
  ): Promise<UpdateResult> {
    return await this.userService.update(id, dto);
  }
}
