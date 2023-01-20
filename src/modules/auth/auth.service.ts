import { HttpException, Injectable, Req } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SigninUserDto } from './dto/signin-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ResultData } from '../../common/utils';
import { HttpCodeEnum } from '../../common/enum/http-code.enum';
import { User } from '../users/entities/users.entity';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signIn(signInDto: SigninUserDto): Promise<ResultData> {
    const { username, password } = signInDto;
    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      return ResultData.error(HttpCodeEnum.UNAUTHORIZED, '用户名或密码错误');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(user.password, password, 'isMatch');
    if (!isMatch) {
      return ResultData.error(HttpCodeEnum.UNAUTHORIZED, '用户名或密码错误');
    }
    const payload = { username, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    return ResultData.success('登录成功', { access_token });
  }

  async signUp(signUpDto: SigninUserDto): Promise<ResultData> {
    return await this.userService.create(signUpDto);
  }

  async validateUser(id: number): Promise<User> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new HttpException('用户不存在', 401);
    }
    return user;
  }
}
