import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {

  @ApiProperty({
    example: 'PT Malang Digital',
  })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'Jl. Soekarno Hatta',
  })
  @IsNotEmpty()
  address!: string;

  @ApiProperty({
    example: 'Web Development',
  })
  @IsNotEmpty()
  field!: string;

  @ApiProperty({
    example: 'Software House',
  })
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    example: 10,
  })
  @IsInt()
  quota!: number;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  status!: boolean;

}