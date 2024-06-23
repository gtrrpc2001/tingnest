import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

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
  readonly title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly create_at: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly writetime: string;
  
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly content: string;  

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly location: string;  

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly appointment: string;  

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number, description: '' })
  readonly max_participants: number; 

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number, description: '' })
  readonly current_participants: number; 

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number, description: '' })
  readonly is_private: number; 

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number, description: '' })
  readonly code: number;
}
