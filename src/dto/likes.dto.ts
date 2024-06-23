import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class LikesDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: 'post 구분 값' })
  readonly kind: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly id: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, description: '' })
  readonly nbo_idx: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, description: '' })
  readonly comment_idx: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, description: '' })
  readonly cmtCmt_idx: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly writetime: string;
}
