import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { GetRoleDto } from './dto/get-role.dto';
import { JwtGuard } from '../../guards/jwt.guard';
import { CaslGuard } from '../../guards/casl.guard';

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
}
