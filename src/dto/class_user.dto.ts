import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class ClassUserDTO {
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly kind: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly id: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type:Number, description: '' })
  readonly class_idx: number;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type:'datetime', description: '' })
  readonly joined_at: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: 'tinyint', description: '' })
  readonly status: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: 'tinyint', description: '' })
  readonly role: number;
}
