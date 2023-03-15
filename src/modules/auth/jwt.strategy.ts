import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../../common/enum/config.enum';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    protected configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      //从请求头Cookie中获取token
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req?.signedCookies?.access_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(ConfigEnum.JWT_SECRET),
    });
  }

  async validate(payload: any) {
    return await this.authService.validateUser(payload.sub);
  }
}
