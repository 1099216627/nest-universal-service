import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AxiosService {
  constructor(private readonly httpService: HttpService) {}

  async get(url: string) {
    const { data } = await this.httpService.axiosRef.get(url);
    return data.data;
  }
}
