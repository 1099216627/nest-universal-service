import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  getStatistics() {
    const obj = {
      visits: 100,
      sales: 1000,
      orders: 100,
      volume: 10000,
    };
    return obj;
  }
}
