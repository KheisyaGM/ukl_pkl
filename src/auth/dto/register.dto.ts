import {
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {

  @ApiProperty({
    example: 'Kheisya',
  })
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'khei@gmail.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '123456',
  })
  @MinLength(6)
  password!: string;

}