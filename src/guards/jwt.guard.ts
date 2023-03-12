import { UsersService } from './../modules/users/users.service';
import { AccountStatusEnum } from './../common/enum/config.enum';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { verify } from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';
import { ConfigEnum } from 'src/common/enum/config.enum';

export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    @InjectRedis() private readonly redis: Redis,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.signedCookies['access_token'];
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await verify(
        token,
        this.configService.get(ConfigEnum.JWT_SECRET),
      );

      const username = payload['username'];
      const id = payload['sub'];
      const user = await this.usersService.findOne(id);
      if (!user || user.status !== AccountStatusEnum.ENABLED) {
        throw new UnauthorizedException();
      }
      const tokenCache = username ? await this.redis.get(username) : null;
      if (!payload || !username || tokenCache !== token) {
        username && (await this.redis.del(username));
        throw new UnauthorizedException();
      }
      const parentCanActivate = (await super.canActivate(context)) as boolean;
      return parentCanActivate;
    } catch (error) {
      //jwt 过期抛出错误401
      throw new UnauthorizedException();
    }
  }
}
