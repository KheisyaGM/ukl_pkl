import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Delete,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';

import { ApplicationsService } from './applications.service';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import {
  ApiBearerAuth,
  ApiConsumes,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';

import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@ApiTags('applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  // =========================
  // CREATE APPLICATION
  // =========================
  @Post()
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        companyId: { type: 'number' },
        cvFile: { type: 'string', format: 'binary' },
        portfolioFile: { type: 'string', format: 'binary' },
        transcriptFile: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
@UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'cvFile', maxCount: 1 },
        { name: 'portfolioFile', maxCount: 1 },
        { name: 'transcriptFile', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const filename = `${Date.now()}-${file.originalname}`;
            cb(null, filename);
          },
        }),
      },
    ),
  )
  async create(
  @UploadedFiles() files: any,
  @Body() dto: CreateApplicationDto,
  @Request() req,
) {
  if (
    !files?.cvFile?.[0] ||
    !files?.portfolioFile?.[0] ||
    !files?.transcriptFile?.[0]
  ) {
    throw new BadRequestException('All files are required');
  }

  if (!dto.companyId) {
    throw new BadRequestException('companyId is required');
  }

  console.log('USER:', req.user); // 🔥 DEBUG: Cek isi req.user
  console.log('FILES:', files); // 🔥 DEBUG: Cek file yang diupload
  console.log('DTO:', dto); // 🔥 DEBUG: Cek isi DTO

  return this.applicationsService.create({
    userId: req.user.sub, // 🔥 FIX INI PALING PENTING
    companyId: Number(dto.companyId),
    cvFile: files.cvFile[0].filename,
    portfolioFile: files.portfolioFile[0].filename,
    transcriptFile: files.transcriptFile[0].filename,
  });
}

  // =========================
  // GET ALL (ADMIN)
  // =========================
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')findAll() {
    return this.applicationsService.findAll();
  }

  // =========================
  // GET DETAIL
  // =========================
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.applicationsService.findOne(id);
  }

  // =========================
  // UPDATE APPLICATION (USER)
  // =========================
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateApplication(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateApplicationDto,
    @Request() req,
  ) {
    return this.applicationsService.updateApplication(
      id,
      dto,
      req.user.sub,
    );
  }

  // =========================
  // DELETE APPLICATION (USER)
  // =========================
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteApplication(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.applicationsService.deleteApplication(
      id,
      req.user.sub,
    );
  }
  // UPDATE STATUS (ADMIN)
  // =========================
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
  ) {return this.applicationsService.updateStatus(
      id,dto.status,dto.note,
    );
}
}