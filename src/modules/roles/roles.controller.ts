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
  UseInterceptors,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { GetRoleDto } from './dto/get-role.dto';
import { JwtGuard } from '../../guards/jwt.guard';
import { CaslGuard } from '../../guards/casl.guard';
import { ResultData } from '../../common/utils';
import { Can } from '../../decorators/casl.decorator';
import { ActionEnum } from '../../common/enum/action.enum';
import { Role } from './entities/roles.entity';
import { LoggerInterceptor } from '../../interceptors/logger.interceptor';
import { setRouteNameDecorator } from '../../decorators/set-route-name.decorator';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('role')
@UseGuards(JwtGuard, CaslGuard)
@UseInterceptors(LoggerInterceptor)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Can(ActionEnum.READ, Role)
  @setRouteNameDecorator('查询所有角色')
  async findAllRoles(@Query() query: GetRoleDto) {
    return await this.rolesService.findAll(query);
  }

  @Post()
  @Can(ActionEnum.CREATE, Role)
  @setRouteNameDecorator('创建角色')
  async createUser(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService.create(createRoleDto);
  }

  @Put(':id/permission')
  @Can(ActionEnum.UPDATE, Role)
  @setRouteNameDecorator('更新角色权限')
  async updateRolePermission(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return await this.rolesService.updatePermission(id, updatePermissionDto);
  }

  @Put(':id')
  @Can(ActionEnum.UPDATE, Role)
  @setRouteNameDecorator('更新角色')
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() createRoleDto: CreateRoleDto,
  ) {
    return await this.rolesService.update(id, createRoleDto);
  }

  @Delete(':id')
  @Can(ActionEnum.DELETE, Role)
  @setRouteNameDecorator('删除角色')
  async deleteRole(@Param('id', ParseIntPipe) id: number) {
    return await this.rolesService.delete(id);
  }

  @Get('all')
  @Can(ActionEnum.READ, Role)
  @setRouteNameDecorator('查询所有角色')
  async findAll() {
    return await this.rolesService.find();
  }

  @Get(':id')
  @Can(ActionEnum.READ, Role)
  @setRouteNameDecorator('查询角色')
  async findOneRole(@Param('id', ParseIntPipe) id: number) {
    const result = await this.rolesService.findOne(id);
    return ResultData.success('获取用户信息成功', result);
  }
}
