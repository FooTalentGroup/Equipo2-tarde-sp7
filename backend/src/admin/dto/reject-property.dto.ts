import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RejectPropertyDto {
  @ApiProperty({ example: 'Property does not meet listing requirements' })
  @IsString()
  reason: string;
}
