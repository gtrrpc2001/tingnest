import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { Double, Int32 } from 'typeorm';
import { NboImgDTO } from './nboimg.dto';

export class NboDTO {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly kind: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, description: 'key' })
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
  @ApiProperty({ type: String, description: '닉네임' })
  readonly aka: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, description: '좋아요' })
  readonly likes: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '카테고리' })
  readonly vilege: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '내용' })
  readonly content: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: 'NboImgDTO', description: 'nboImgDto' })
  readonly nboImgDto: NboImgDTO;
}
