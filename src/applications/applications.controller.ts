import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
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
} from '@nestjs/swagger';

@ApiTags('applications')
@Controller('applications')
export class ApplicationsController {

  constructor(
    private applicationsService: ApplicationsService,
  ) {}
  @ApiBearerAuth()
@ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @Post()
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
          filename: (req, file, callback) => {

            const filename =
              Date.now() +
              '-' +
              file.originalname;

            callback(null, filename);

          },
        }),
      },
    ),
  )
  async create(
    @UploadedFiles() files,
    @Body() body,
    @Request() req,
  ) {

    return this.applicationsService.create({
      userId: req.user.sub,
      companyId: Number(body.companyId),

      cvFile:
        files.cvFile[0].filename,

      portfolioFile:
        files.portfolioFile[0].filename,

      transcriptFile:
        files.transcriptFile[0].filename,
    });

  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.applicationsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.applicationsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body,
  ) {

    return this.applicationsService.updateStatus(
      id,
      body.status,
      body.note,
    );

  }

}