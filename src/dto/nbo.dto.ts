import { ApiProperty } from "@nestjs/swagger";
import { IsNumber,IsOptional,IsString } from "class-validator";
import { Double,Int32 } from "typeorm";

export class NboDTO{
    @IsString()
    @IsOptional()
    @ApiProperty({type:String, description:''})
    readonly kind: string;
    
    @IsString()
    @ApiProperty({type:String, description:''})
    readonly id:string;

    @IsString()
    @ApiProperty({type:String, description:''})
    readonly writetime:string;

    @IsString()
    @IsOptional()
    @ApiProperty({type:String, description:'닉네임'})
    readonly aka:string;
}