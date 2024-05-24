import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsArray } from 'class-validator';
import { Double, Int32 } from 'typeorm';

export class UserDTO {
  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: 'post 구분 값' })
  readonly kind: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: 'number', description: '' })
  readonly idx: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly id: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly pwd: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly phone: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly birth: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly gender: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly signupdate: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly writetime: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number, description: '' })
  readonly pause: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly imgupdate: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: Number, description: '' })
  readonly profile: number[];

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '닉네임' })
  readonly aka: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ type: Number, description: '' })
  readonly guard: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '활동' })
  activate: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '' })
  access_token: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: '' })
  refresh_token: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ type: String, description: 'firebase' })
  alarm_token: string;
}
