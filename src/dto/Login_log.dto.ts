import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Double, Int32 } from 'typeorm';

export class Login_logDTO {
  @IsString()
  @ApiProperty({ type: String, description: '' })
  readonly id: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly writetime?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, description: '' })
  readonly activity: string;
}
