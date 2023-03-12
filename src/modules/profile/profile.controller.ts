import { User } from './../users/entities/users.entity';
import {
  Body,
  Controller,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { LoggerInterceptor } from '../../interceptors/logger.interceptor';
import { JwtGuard } from '../../guards/jwt.guard';
import { setRouteNameDecorator } from '../../decorators/set-route-name.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ResultData } from '../../common/utils';
import { GetUser } from 'src/decorators/get-user.decorator';

@Controller('profile')
@UseInterceptors(LoggerInterceptor)
@UseGuards(JwtGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Put()
  @setRouteNameDecorator('修改个人资料')
  async updatePassword(
    @GetUser() userInfo,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ResultData> {
    return await this.profileService.update(userInfo.id, updateProfileDto);
  }
}
