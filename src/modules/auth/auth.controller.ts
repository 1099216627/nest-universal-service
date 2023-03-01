import { ChangePasswordDto } from './dto/change-password.dto';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';
import { JwtGuard } from '../../guards/jwt.guard';
import { ResultData } from '../../common/utils';
import { LoggerInterceptor } from '../../interceptors/logger.interceptor';
import { setRouteNameDecorator } from '../../decorators/set-route-name.decorator';
import { GetUser } from 'src/decorators/get-user.decorator';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor, LoggerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @setRouteNameDecorator('登陆')
  async signin(@Body() signInDto: SigninUserDto): Promise<ResultData> {
    return this.authService.signIn(signInDto);
  }

  @Post('signup')
  @setRouteNameDecorator('注册')
  async signup(@Body() signUpDto: SigninUserDto): Promise<ResultData> {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(JwtGuard)
  @Get('userInfo')
  @setRouteNameDecorator('获取用户信息')
  async userInfo(@Req() req): Promise<ResultData> {
    return ResultData.success('获取用户信息成功', req.user);
  }

  @UseGuards(JwtGuard)
  @Put('password')
  @setRouteNameDecorator('修改密码')
  async updatePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser() user,
  ): Promise<ResultData> {
    return this.authService.updatePassword(changePasswordDto, user);
  }

  @UseGuards(JwtGuard)
  @Post('signout')
  @setRouteNameDecorator('登出')
  async logout(@Res() res): Promise<ResultData> {
    return this.authService.logout(res);
  }
}
