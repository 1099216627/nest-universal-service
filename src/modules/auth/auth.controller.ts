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
  Response,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';
import { JwtGuard } from '../../guards/jwt.guard';
import { generateUUID, ResultData } from '../../common/utils';
import { LoggerInterceptor } from '../../interceptors/logger.interceptor';
import { setRouteNameDecorator } from '../../decorators/set-route-name.decorator';
import { GetUser } from 'src/decorators/get-user.decorator';
import * as svgCaptcha from 'svg-captcha';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor, LoggerInterceptor)
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @Get('captcha')
  async getCaptcha(): Promise<ResultData> {
    const { data, text } = svgCaptcha.create({
      size: 4,
      noise: 2,
      color: true,
      height: 38,
      background: '#666',
      charPreset: '1234567890',
    });
    const result = {
      img: `data:image/svg+xml;base64,${Buffer.from(data).toString('base64')}`,
      id: generateUUID(), // this.utils.generateUUID()
    };
    await this.redis.set(`admin:captcha:img:${result.id}`, text, 'EX', 60 * 5); //验证码有效期5分钟
    return ResultData.success('获取验证码成功', result);
  }

  @Post('signin')
  @setRouteNameDecorator('登陆')
  async signin(@Body() signInDto: SigninUserDto, @Req() req, @Res() res) {
    const result = await this.authService.signIn(signInDto, req, res);
    res.send(result);
  }

  @Post('signup')
  @setRouteNameDecorator('注册')
  async signup(@Body() signUpDto: SigninUserDto): Promise<ResultData> {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(JwtGuard)
  @Get('userInfo')
  @setRouteNameDecorator('获取用户信息')
  async userInfo(@Req() req) {
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
  async logout(@Response() res): Promise<ResultData> {
    return this.authService.logout(res);
  }

  @UseGuards(JwtGuard)
  @Get('refreshToken')
  @setRouteNameDecorator('刷新token')
  async refreshToken(@Req() req, @Res() res) {
    return this.authService.refreshToken(req, res);
  }
}
