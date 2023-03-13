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
import { Role } from './entities/roles.entity';
import { LoggerInterceptor } from '../../interceptors/logger.interceptor';
import { setRouteNameDecorator } from '../../decorators/set-route-name.decorator';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { RoleAction } from 'src/common/enum/action.enum';

@Controller('role')
@UseGuards(JwtGuard, CaslGuard)
@UseInterceptors(LoggerInterceptor)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @setRouteNameDecorator('查询角色列表')
  @Can(RoleAction.READ, Role)
  async findAllRoles(@Query() query: GetRoleDto) {
    return await this.rolesService.findAll(query);
  }

  @Post()
  @setRouteNameDecorator('创建角色')
  @Can(RoleAction.CREATE, Role)
  async createUser(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService.create(createRoleDto);
  }

  @Put('permission/:id')
  @setRouteNameDecorator('更新角色权限')
  @Can(RoleAction.PERMISSION, Role)
  async updateRolePermission(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return await this.rolesService.updatePermission(id, updatePermissionDto);
  }

  @Put(':id')
  @setRouteNameDecorator('编辑角色')
  @Can(RoleAction.UPDATE, Role)
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() createRoleDto: CreateRoleDto,
  ) {
    return await this.rolesService.update(id, createRoleDto);
  }

  @Delete(':id')
  @setRouteNameDecorator('删除角色')
  @Can(RoleAction.DELETE, Role)
  async deleteRole(@Param('id', ParseIntPipe) id: number) {
    return await this.rolesService.delete(id);
  }

  @Get('all')
  @setRouteNameDecorator('查询所有角色')
  async findAll() {
    return await this.rolesService.find();
  }

  @Get(':id')
  @setRouteNameDecorator('查询角色')
  async findOneRole(@Param('id', ParseIntPipe) id: number) {
    const result = await this.rolesService.findOne({ id });
    return ResultData.success('获取用户信息成功', result);
  }

  @Put('lock/:id')
  @setRouteNameDecorator('锁定角色')
  @Can(RoleAction.LOCK, Role)
  async lockRole(@Param('id', ParseIntPipe) id: number) {
    return await this.rolesService.lock(id);
  }

  @Put('unlock/:id')
  @setRouteNameDecorator('解锁角色')
  @Can(RoleAction.UNLOCK, Role)
  async unlockRole(@Param('id', ParseIntPipe) id: number) {
    return await this.rolesService.unlock(id);
  }
}
