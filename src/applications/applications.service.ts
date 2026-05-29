import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

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
    return this.prisma.application.create({
      data: {
        user: {
          connect: { id: data.userId },
        },
        company: {
          connect: { id: Number(data.companyId) },
        },
        cvFile: data.cvFile,
        portfolioFile: data.portfolioFile,
        transcriptFile: data.transcriptFile,
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
  const [updatedApplication] = await this.prisma.$transaction([
    // 1. Update status di tabel application
    this.prisma.application.update({
      where: { id },
      data: { status, note },
      include: {
        user: true,
        company: true,
      },
    }),

    // 2. Catat riwayat di tabel statusLog
    this.prisma.statusLog.create({
      data: {
        applicationId: id,
        status,
        note,
      },
    }),
  ]);

  return {
    message: `Application status updated to ${status}`,
    data: updatedApplication,
  };}
}