import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CommentDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: 'post 구분 값' })
  readonly kind?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, description: '' })
  readonly idx: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly writetime: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly imgupDate: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, description: '' })
  readonly useridx: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, description: '' })
  readonly postNum: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly aka: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, description: '' })
  readonly likes: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly content: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, description: '' })
  readonly isImg: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, description: '' })
  readonly commentes: number;

  @IsArray()
  @IsOptional()
  @ApiProperty({ type: 'number[][]', description: '' })
  readonly img?: number[][];

  @IsOptional()
  @ApiProperty({ type: 'CmtDTO[]', description: 'commentArray' })
  readonly comments?:CmtDTO[]
}

export class CmtDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly kind: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, description: '' })
  readonly idx: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly writetime: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly imgupDate: string;
  
  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, description: '' })
  readonly useridx: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, description: '' })
  readonly nboNum: number;

  @IsNumber()
  @ApiProperty({ type: Number, description: '' })
  readonly commentNum: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly aka: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, description: '' })
  readonly likes: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly content: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, description: '' })
  readonly isImg: number;

  @IsArray()
  @IsOptional()
  @ApiProperty({ type: 'number[][]', description: '' })
  readonly img?: number[][];
}
