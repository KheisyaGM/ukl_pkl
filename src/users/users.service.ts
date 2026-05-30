import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        gender: true,
        birthPlace: true,
        birthDate: true,
        phone: true,
        address: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      message: 'Users retrieved successfully',
      total: users.length,
      data: users,
    };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        gender: true,
        birthPlace: true,
        birthDate: true,
        phone: true,
        address: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return {
      message: 'Profile retrieved successfully',
      data: user,
    };
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.email && { email: dto.email }),
        ...(dto.gender && { gender: dto.gender }),
        ...(dto.birthPlace && { birthPlace: dto.birthPlace }),
        ...(dto.birthDate && { birthDate: new Date(dto.birthDate) }),
        ...(dto.phone && { phone: dto.phone }),
        ...(dto.address && { address: dto.address }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        gender: true,
        birthPlace: true,
        birthDate: true,
        phone: true,
        address: true,
      },
    });

    return {
      message: 'Profile updated successfully',
      data: updated,
    };
  }

  async deleteUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');

    await this.prisma.user.delete({ where: { id } });

    return { message: 'User deleted successfully' };
  }
}