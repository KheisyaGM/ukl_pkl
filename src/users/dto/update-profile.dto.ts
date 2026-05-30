import { IsOptional, IsString, IsEmail, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Kheisya Grace', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'khei@gmail.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'Perempuan', required: false })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ example: 'Malang', required: false })
  @IsOptional()
  @IsString()
  birthPlace?: string;

  @ApiProperty({ example: '2005-01-01', required: false })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiProperty({ example: '08123456789', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Jl. Contoh No. 1', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}