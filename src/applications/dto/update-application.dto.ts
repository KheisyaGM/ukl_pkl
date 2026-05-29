import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateApplicationDto {
  @IsOptional()
  @IsInt()
  companyId?: number;

  @IsOptional()
  @IsString()
  cvFile?: string;

  @IsOptional()
  @IsString()
  portfolioFile?: string;

  @IsOptional()
  @IsString()
  transcriptFile?: string;
}