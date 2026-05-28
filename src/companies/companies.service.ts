import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async create(dto: CreateCompanyDto) {

    const company =
      await this.prisma.company.create({
        data: dto,
      });

    return {
      message:
        'Company created successfully',

      data: company,
    };

  }

  async findAll() {

    const companies =
      await this.prisma.company.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

    return {
      message:
        'Companies retrieved successfully',

      total: companies.length,

      data: companies,
    };

  }

  async findOne(id: number) {

    const company =
      await this.prisma.company.findUnique({
        where: {
          id,
        },
      });

    return {
      message:
        'Company detail retrieved successfully',

      data: company,
    };

  }

  async update(
    id: number,
    dto: UpdateCompanyDto,
  ) {

    const updatedCompany =
      await this.prisma.company.update({
        where: {
          id,
        },
        data: dto,
      });

    return {
      message:
        'Company updated successfully',

      updatedFields: dto,

      data: updatedCompany,
    };

  }

  async remove(id: number) {

    const deletedCompany =
      await this.prisma.company.delete({
        where: {
          id,
        },
      });

    return {
      message:
        'Company deleted successfully',

      deletedData: deletedCompany,
    };

  }

}