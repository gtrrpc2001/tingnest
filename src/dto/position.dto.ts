import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class PositionDTO {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, description: '' })
  readonly useridx: number;

  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly id?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly writetime?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly imgupdate?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, description: '' })
  readonly latitude?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, description: '' })
  readonly longitude?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly address?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly aka: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, description: '' })
  readonly visible?: number;
}
