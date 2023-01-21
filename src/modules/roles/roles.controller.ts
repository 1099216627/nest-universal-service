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
import { Can } from '../../decorators/casl.decorator';
import { ActionEnum } from '../../common/enum/action.enum';
import { Role } from './entities/roles.entity';

@Controller('role')
@UseGuards(JwtGuard, CaslGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Can(ActionEnum.READ, Role)
  async findAllRoles(@Query() query: GetRoleDto) {
    return await this.rolesService.findAll(query);
  }

  @Post()
  @Can(ActionEnum.CREATE, Role)
  async createUser(@Body() createRoleDto: CreateRoleDto) {
    return await this.rolesService.create(createRoleDto);
  }

  @Get(':id')
  @Can(ActionEnum.READ, Role)
  async findOneRole(@Param('id', ParseIntPipe) id: number) {
    const result = await this.rolesService.findOne(id);
    return ResultData.success('获取用户信息成功', result);
  }

  @Put(':id')
  @Can(ActionEnum.UPDATE, Role)
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() createRoleDto: CreateRoleDto,
  ) {
    return await this.rolesService.update(id, createRoleDto);
  }

  @Delete(':id')
  @Can(ActionEnum.DELETE, Role)
  async deleteRole(@Param('id', ParseIntPipe) id: number) {
    return await this.rolesService.delete(id);
  }
}
