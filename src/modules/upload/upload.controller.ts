import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as process from 'process';
import { ResultData } from '../../common/utils';
import { HttpCodeEnum } from '../../common/enum/http-code.enum';
import { LoggerInterceptor } from '../../interceptors/logger.interceptor';
import { JwtGuard } from '../../guards/jwt.guard';
import { setRouteNameDecorator } from '../../decorators/set-route-name.decorator';

@Controller('upload')
@UseGuards(JwtGuard)
@UseInterceptors(LoggerInterceptor)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @setRouteNameDecorator('上传图片')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, process.cwd() + '/uploads' + '/images');
        },
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async uploadImage(@UploadedFile() file: any): Promise<ResultData> {
    try {
      const url = await this.uploadService.putOssFile(
        `/image/${file.originalname}`,
        process.cwd() + '/uploads' + '/images/' + file.originalname,
      );
      return ResultData.success('上传成功', url);
    } catch (e) {
      return ResultData.error(HttpCodeEnum.INTERNAL_SERVER_ERROR, '上传失败');
    }
  }
}
