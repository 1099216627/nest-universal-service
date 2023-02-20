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
import { CaslGuard } from '../../guards/casl.guard';
import { JwtGuard } from '../../guards/jwt.guard';
import { setRouteNameDecorator } from '../../decorators/set-route-name.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ResultData } from '../../common/utils';

@Controller('profile')
@UseInterceptors(LoggerInterceptor)
@UseGuards(JwtGuard, CaslGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Put('/:id')
  @setRouteNameDecorator('修改用户信息')
  async updateProfile(
    @Param('id') id,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ResultData> {
    return await this.profileService.update(id, updateProfileDto);
  }
}
