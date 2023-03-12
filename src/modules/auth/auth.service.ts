import { ChangePasswordDto } from './dto/change-password.dto';
import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SigninUserDto } from './dto/signin-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ResultData } from '../../common/utils';
import { HttpCodeEnum } from '../../common/enum/http-code.enum';
import { User } from '../users/entities/users.entity';
import { AccountStatusEnum } from '../../common/enum/config.enum';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import * as RequestIp from 'request-ip';
import { AxiosService } from '../../common/lib/axios/axios.service';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private axiosService: AxiosService,
    private jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
  ) {}
  async signIn(
    signInDto: SigninUserDto,
    req: Request,
    res: any,
  ): Promise<ResultData> {
    const { username, password, code, codeId } = signInDto;
    await this.checkCaptcha(code, codeId);
    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      return ResultData.error(HttpCodeEnum.UNAUTHORIZED, '用户名或密码错误');
    }
    if (
      user.status === AccountStatusEnum.DISABLE ||
      user.status === AccountStatusEnum.DELETE
    ) {
      return ResultData.error(HttpCodeEnum.UNAUTHORIZED, '用户已被禁用');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return ResultData.error(HttpCodeEnum.UNAUTHORIZED, '用户名或密码错误');
    }
    const payload = { username, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    await this.redis.set(username, access_token);
    const ip = RequestIp.getClientIp(req);
    ip.replace('::ffff:', '');
    const data = await this.axiosService.get(
      `https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?query=${ip}&co=&resource_id=6006&t=1555898284898&ie=utf8&oe=utf8&format=json&tn=baidu`,
    );
    const area = data[0]?.location;
    res.cookie('access_token', access_token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      signed: true, //签名
    });
    //编辑
    await this.userService.updater(user.id, {
      lastLoginTime: new Date(),
      lastLoginArea: area,
    });

    return ResultData.success('登录成功', { access_token });
  }

  async signUp(signUpDto: SigninUserDto): Promise<ResultData> {
    const { code, codeId } = signUpDto;
    await this.checkCaptcha(code, codeId);
    return await this.userService.create(signUpDto);
  }

  async validateUser(id: number): Promise<User> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new HttpException('用户不存在', 401);
    }
    return user;
  }

  async updatePassword(
    changePasswordDto: ChangePasswordDto,
    user,
  ): Promise<ResultData> {
    const id = user.id;
    const findUser = await this.userService.findOne(id);
    const isMatch = await bcrypt.compare(
      changePasswordDto.oldPassword,
      findUser.password,
    );
    if (!isMatch) {
      return ResultData.error(HttpCodeEnum.UNAUTHORIZED, '旧密码错误');
    }
    if (changePasswordDto.newPassword === changePasswordDto.oldPassword) {
      return ResultData.error(
        HttpCodeEnum.UNAUTHORIZED,
        '新密码不能与旧密码相同',
      );
    }
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(changePasswordDto.newPassword, salt);
    findUser.password = password;
    await this.userService.save(findUser);
    return ResultData.success('修改成功');
  }

  async logout(res): Promise<ResultData> {
    const user = res.req.user;
    await this.redis.del(user.username);
    return ResultData.success('退出成功');
  }

  async checkCaptcha(codeId: string, code: string): Promise<ResultData> {
    const captcha = await this.redis.get(`admin:captcha:img:${codeId}`);
    if (!captcha) {
      return ResultData.error(HttpCodeEnum.UNAUTHORIZED, '验证码已过期');
    }
    if (captcha.toLowerCase() !== code.toLowerCase()) {
      await this.redis.del(`admin:captcha:img:${codeId}`);
      return ResultData.error(HttpCodeEnum.UNAUTHORIZED, '验证码错误');
    }
    await this.redis.del(`admin:captcha:img:${codeId}`);
    return ResultData.success('验证码正确');
  }

  async refreshToken(req, res) {
    const user = req.user;
    const payload = { username: user.username, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    await this.redis.set(user.username, access_token);
    return ResultData.success('刷新成功', { access_token });
  }
}
