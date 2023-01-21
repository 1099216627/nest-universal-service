import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as process from 'process';
import { ResultData } from '../../common/utils';
import { HttpCodeEnum } from '../../common/enum/http-code.enum';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
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
