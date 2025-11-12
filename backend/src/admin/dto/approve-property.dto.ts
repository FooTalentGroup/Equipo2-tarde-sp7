import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ApprovePropertyDto {
  @ApiPropertyOptional({ example: 'Property meets all requirements' })
  @IsString()
  @IsOptional()
  note?: string;
}
