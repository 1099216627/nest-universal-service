import {
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { JwtGuard } from '../../guards/jwt.guard';
import { LoggerInterceptor } from '../../interceptors/logger.interceptor';
import { CaslGuard } from '../../guards/casl.guard';
import { setRouteNameDecorator } from '../../decorators/set-route-name.decorator';

@Controller('menu')
@UseGuards(JwtGuard, CaslGuard)
@UseInterceptors(LoggerInterceptor)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @setRouteNameDecorator('查询所有菜单')
  async getMenus() {
    return await this.menuService.findAll();
  }

  @Get('permissions')
  @setRouteNameDecorator('查询所有权限')
  async getPermissions() {
    return await this.menuService.findAllPermission();
  }

  //查询用户拥有的菜单和权限
  @Get('user')
  @setRouteNameDecorator('查询用户菜单')
  async getUserMenus(@Req() req) {
    return await this.menuService.findUserMenus(req);
  }
}
