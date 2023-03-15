import { UsersService } from './../modules/users/users.service';
import { AccountStatusEnum } from './../common/enum/config.enum';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { verify } from 'jsonwebtoken';
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

    const tokenCache = id ? await this.redis.get(`access_token_${id}`) : null;
    if (!payload || !username || tokenCache !== token || !id) {
      id && (await this.redis.del(`access_token_${id}`));
      throw new UnauthorizedException();
    }
    //加入bearer token
    request.headers.authorization = `Bearer ${token}`;
    return (await super.canActivate(context)) as boolean;
  }
}
