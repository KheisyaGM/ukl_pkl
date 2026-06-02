import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { Application } from '@prisma/client';
import { CreateApplicationPayload } from './dto/application-payload.type';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async create(data: CreateApplicationPayload) {

    // 1. Cek user exist & ambil data diri
    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. Validasi data diri harus sudah lengkap
    if (!user.gender || !user.birthPlace || !user.birthDate || !user.phone || !user.address) {
      throw new BadRequestException(
        'Lengkapi data diri terlebih dahulu sebelum mengajukan PKL (gender, tempat lahir, tanggal lahir, nomor HP, alamat)',
      );
    }

    // 3. Buat pengajuan + sertakan data diri di response
    return this.prisma.application.create({
      data: {
        user: { connect: { id: data.userId } },
        company: { connect: { id: Number(data.companyId) } },
        cvFile: data.cvFile,
        portfolioFile: data.portfolioFile,
        transcriptFile: data.transcriptFile,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            gender: true,
            birthPlace: true,
            birthDate: true,
            phone: true,
            address: true,
          },
        },
        company: true,
      },
    });
  }

  async findAll() {
    const applications = await this.prisma.application.findMany({
      include: {
        user: true,
        company: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      message: 'Applications retrieved successfully',
      total: applications.length,
      data: applications,
    };
  }

  async findByUser(userId: number) {
    const applications = await this.prisma.application.findMany({
      where: { userId },
      include: {
        user: true,
        company: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      message: 'My applications retrieved successfully',
      total: applications.length,
      data: applications,
    };
  }

  async findOne(id: number) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        user: true,
        company: true,
      },
    });

    return {
      message: 'Application detail retrieved successfully',
      data: application,
    };
  }

  async updateApplication(id: number, dto: UpdateApplicationDto, userId: number) {
    const application = await this.prisma.application.findFirst({
      where: { id, userId },
    });

    if (!application) {
      throw new NotFoundException('Application not found or unauthorized');
    }

    const updated = await this.prisma.application.update({
      where: { id },
      data: {
        ...(dto.companyId && { company: { connect: { id: Number(dto.companyId) } } }),
        ...(dto.cvFile && { cvFile: dto.cvFile }),
        ...(dto.portfolioFile && { portfolioFile: dto.portfolioFile }),
        ...(dto.transcriptFile && { transcriptFile: dto.transcriptFile }),
      },
      include: { user: true, company: true },
    });

    return {
      message: 'Application updated successfully',
      data: updated,
    };
  }

  async deleteApplication(id: number, userId: number) {
    const application = await this.prisma.application.findFirst({
      where: { id, userId },
    });

    if (!application) {
      throw new NotFoundException('Application not found or unauthorized');
    }

    await this.prisma.application.delete({ where: { id } });

    return { message: 'Application deleted successfully' };
  }

  async updateStatus(
    id: number,
    status: Application['status'],
    note?: string,
  ) {
    // ambil data application dulu untuk dapat companyId
    const application = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return this.prisma.$transaction(async (tx) => {
      // update status application
      const updatedApplication = await tx.application.update({
        where: { id },
        data: { status, note },
        include: {
          user: true,
          company: true,
        },
      });

      // catat status log
      await tx.statusLog.create({
        data: {
          applicationId: id,
          status,
          note,
        },
      });

      // kurangi quota kalau ACCEPTED ← TAMBAHAN BARU
      if (status === 'ACCEPTED') {
        await tx.company.update({
          where: { id: application.companyId },
          data: { quota: { decrement: 1 } },
        });
      }

      return {
        message: `Application status updated to ${status}`,
        data: updatedApplication,
      };
    });
  }
}