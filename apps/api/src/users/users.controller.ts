import { Controller, Get, Param, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdatePreferredLocaleDto } from './dto/update-preferred-locale.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch('me/locale')
  async updatePreferredLocale(
    @Request() req,
    @Body() dto: UpdatePreferredLocaleDto,
  ) {
    return this.usersService.updatePreferredLocale(req.user.userId, dto.locale);
  }
}
