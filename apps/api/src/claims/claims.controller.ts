import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('claims')
@UseGuards(JwtAuthGuard)
export class ClaimsController {
  constructor(private claimsService: ClaimsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() dto: CreateClaimDto) {
    return this.claimsService.create(req.user.id, dto);
  }

  @Get()
  async findAll(@Request() req) {
    return this.claimsService.findAllByUser(req.user.id);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.claimsService.findOne(id, req.user.id);
  }

  @Patch(':id/submit')
  @HttpCode(HttpStatus.OK)
  async submit(@Request() req, @Param('id') id: string) {
    return this.claimsService.submit(id, req.user.id);
  }
}
