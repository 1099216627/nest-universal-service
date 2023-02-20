import { Controller, Get, UseInterceptors, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { LoggerInterceptor } from '../../interceptors/logger.interceptor';
import { CaslGuard } from '../../guards/casl.guard';
import { JwtGuard } from '../../guards/jwt.guard';

@Controller('dashboard')
@UseInterceptors(LoggerInterceptor)
@UseGuards(JwtGuard, CaslGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getStatistics() {
    return this.dashboardService.getStatistics();
  }
}
