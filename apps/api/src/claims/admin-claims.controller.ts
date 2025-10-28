import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('admin/claims')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminClaimsController {
  constructor(private claimsService: ClaimsService) {}

  @Get()
  async getAllClaims() {
    return this.claimsService.findAllForAdmin();
  }

  @Get(':id')
  async getClaimById(@Param('id') id: string) {
    return this.claimsService.findOneForAdmin(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.claimsService.updateStatus(id, status);
  }
}
