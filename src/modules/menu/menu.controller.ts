import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { JwtGuard } from '../../guards/jwt.guard';

@Controller('menu')
@UseGuards(JwtGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getMenus() {
    return await this.menuService.findAll();
  }

  //查询用户拥有的菜单和权限
  @Get('user')
  async getUserMenus(@Req() req) {
    return await this.menuService.findUserMenus(req);
  }
}
