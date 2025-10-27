import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StatsService } from './stats.service';

@Controller('admin/stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get('overview')
  async getOverview() {
    return this.statsService.getOverviewStats();
  }

  @Get('claims-by-month')
  async getClaimsByMonth(@Query('months') months?: string) {
    const monthsCount = months ? parseInt(months, 10) : 6;
    return this.statsService.getClaimsByMonth(monthsCount);
  }

  @Get('top-airlines')
  async getTopAirlines(@Query('limit') limit?: string) {
    const limitCount = limit ? parseInt(limit, 10) : 5;
    return this.statsService.getTopAirlines(limitCount);
  }

  @Get('recent-claims')
  async getRecentClaims(@Query('limit') limit?: string) {
    const limitCount = limit ? parseInt(limit, 10) : 10;
    return this.statsService.getRecentClaims(limitCount);
  }
}
