import { Global, Module } from '@nestjs/common';
import { AxiosService } from './axios.service';
import { HttpModule } from '@nestjs/axios';
@Global()
@Module({
  controllers: [],
  providers: [AxiosService],
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  exports: [AxiosService],
})
export class AxiosModule {}
