import { Controller, Get, Patch, Delete, Param, Body, Request, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // GET semua user (ADMIN)
  @Get()
@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.usersService.findAll();
  }

  // GET profil sendiri (SISWA & ADMIN)
  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SISWA', 'ADMIN') // ← fix: tambah RolesGuard & role
  getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.sub);
  }

  // PATCH update profil sendiri (SISWA & ADMIN)
  @Patch('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SISWA', 'ADMIN') // ← fix: tambah RolesGuard & role
  updateProfile(@Request() req, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.sub, dto);
  }

  // DELETE hapus user (ADMIN)
  @Delete(':id')
@UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}