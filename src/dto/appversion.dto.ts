import { IsNumber,IsOptional,IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class AppversionDTO{   
    @IsString()
    @ApiProperty({type:String, description:''})
    readonly admin:string;

    @IsOptional()    
    @IsString()
    @ApiProperty({type:String, description:''})
    readonly appversion:string;
}