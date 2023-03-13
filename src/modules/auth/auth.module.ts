import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../../common/enum/config.enum';
import { JwtStrategy } from './jwt.strategy';
import { CaslService } from './casl.service';
@Global()
@Module({
  providers: [AuthService, JwtStrategy, CaslService],
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(ConfigEnum.JWT_SECRET),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  exports: [CaslService],
})
export class AuthModule {}
