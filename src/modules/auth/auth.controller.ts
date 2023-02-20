import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';
import { JwtGuard } from '../../guards/jwt.guard';
import { ResultData } from '../../common/utils';
import { LoggerInterceptor } from '../../interceptors/logger.interceptor';
import { setRouteNameDecorator } from '../../decorators/set-route-name.decorator';

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
  @Get('logout')
  @setRouteNameDecorator('登出')
  async logout(): Promise<ResultData> {
    return this.authService.logout();
  }
}
