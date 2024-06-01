import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class ClassesDTO {
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly kind: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly id: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type:'number[]', description: '' })
  readonly background_img: number[];

  @IsOptional()
  @IsArray()
  @ApiProperty({ type:'number[]', description: '' })
  readonly profile_img: number[];

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly writetime: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly content: string;  
}
