import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, IsInt } from 'class-validator';

export class CreatePropertyDto {
  @ApiProperty({ example: 'Beautiful Family Home' })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    example: 'Spacious 3-bedroom home with modern amenities',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 350000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: '123 Main Street' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'New York' })
  @IsString()
  city: string;

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(0)
  beds: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(0)
  baths: number;
}
