import { IsInt } from 'class-validator';

export class CreateApplicationDto {

  @IsInt()
  companyId!: number;

}