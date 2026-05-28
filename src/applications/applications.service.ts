import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import {Application} from '@prisma/client';
@Injectable()
export class ApplicationsService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async create(data: any) {

    return this.prisma.application.create({
      data,
    });

  }

 async findAll() {

  const applications =
    await this.prisma.application.findMany({

      include: {
        user: true,
        company: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

  return {
    message:
      'Applications retrieved successfully',

    total: applications.length,

    data: applications,
  };

}

  async findOne(id: number) {

  const application =
    await this.prisma.application.findUnique({
      where: {
        id,
      },

      include: {
        user: true,
        company: true,
      },
    });

  return {
    message:
      'Application detail retrieved successfully',

    data: application,
  };

}
  async updateStatus(
  id: number,
  status: Application['status'],
  note?: string,
) {

  const updatedApplication =
    await this.prisma.application.update({

      where: {
        id,
      },

      data: {
        status,
        note,
      },

      include: {
        user: true,
        company: true,
      },
    });

  return {
    message:
      `Application status updated to ${status}`,

    data: updatedApplication,
  };

}

}