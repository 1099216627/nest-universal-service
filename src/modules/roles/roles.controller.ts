import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { GetRoleDto } from './dto/get-role.dto';
import { JwtGuard } from '../../guards/jwt.guard';
import { CaslGuard } from '../../guards/casl.guard';
import { ResultData } from '../../common/utils';

@Controller('role')
@UseGuards(JwtGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAllRoles(@Query() query: GetRoleDto) {
    return await this.rolesService.findAll(query);
  }

  @Post()
  async createUser(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService.create(createRoleDto);
  }

  @Get(':id')
  async findOneRole(@Param('id', ParseIntPipe) id: number) {
    const result = await this.rolesService.findOne(id);
    return ResultData.success('获取用户信息成功', result);
  }

  @Put(':id')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() createRoleDto: CreateRoleDto,
  ) {
    return await this.rolesService.update(id, createRoleDto);
  }

  @Delete(':id')
  async deleteRole(@Param('id', ParseIntPipe) id: number) {
    return await this.rolesService.delete(id);
  }
}
