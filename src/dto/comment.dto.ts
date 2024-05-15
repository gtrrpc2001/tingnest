import { ApiProperty } from "@nestjs/swagger";
import { IsNumber,IsOptional,IsString } from "class-validator";

export class CommentDTO{
    @IsString()
    @IsOptional()
    @ApiProperty({type:String, description:'post 구분 값'})
    readonly kind: string;

    @IsString()
    @ApiProperty({type:String, description:''})
    readonly id:string;

    @IsString()
    @IsOptional()
    @ApiProperty({type:String, description:''})
    readonly writetime:string;
    
    @IsString()
    @ApiProperty({type:Number, description:''})
    readonly postNum:number;       
    
    @IsString()    
    @IsOptional()
    @ApiProperty({type:String, description:''})
    readonly aka:string;
}