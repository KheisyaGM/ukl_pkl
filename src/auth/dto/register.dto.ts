import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'Kheisya' })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'khei@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '123456' })
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'SISWA', required: false })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}