import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class AlarmDTO{   

    @IsOptional()
    @IsString()
    @ApiProperty({type:String, description:''})
    readonly kind:string;

    @IsOptional()
    @IsString()
    @ApiProperty({type:String, description:''})
    readonly title:string;

    @IsOptional()    
    @IsString()
    @ApiProperty({type:String, description:''})
    readonly token:string;

    @IsOptional()    
    @IsString()
    @ApiProperty({type:"stringArray", description:''})
    readonly tokens:string[];

    @IsOptional()    
    @IsString()
    @ApiProperty({type:String, description:''})
    readonly content:string;

    @IsOptional()    
    @IsString()
    @ApiProperty({type:String, description:''})
    readonly imgUrl:string;
}