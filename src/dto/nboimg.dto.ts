import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class NboImgDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: 'post 구분 값' })
  readonly kind: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, description: '고유 값' })
  readonly idx: number[];

  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly id: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, description: '외래 키' })
  readonly nboidx: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly writetime: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: Number, description: '' })
  readonly nboImg: number[][];
}
