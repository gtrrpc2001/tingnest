import { Controller, Get,Post,Body,Query} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ecg_byteDTO } from 'src/dto/ecg_byte.dto';
import { ecg_byteService } from 'src/service/ecg_byte.service';

@Controller('mslecgbyte')
@ApiTags('mslecg')
export class ecg_byteController {
  constructor(private readonly ecg_byteService: ecg_byteService) {}  

  @Post("/api_getdata")
 async postAll(    
   @Body() body: ecg_byteDTO): Promise<any> {        
    return await this.ecg_byteService.gubunKind(body);
  }

  @Get("/test")
 async getTest(       
   @Query('eq') eq:string,
   @Query('startDate') startDate:string,
   @Query('endDate') endDate:string): Promise<string> {       
    return await this.ecg_byteService.getTest(eq,startDate,endDate);
  }

//   @Get("/stringECHToByte")
//  async getChangeEcg(       
//    @Query('idx') idx:number,
//    @Query('limit') limit:number   
//    ): Promise<number> {       
//     return await this.ecg_byteService.EcgToByte(idx,limit);
//   }

  @Get("/Ecg")
  async getEcg(       
    @Query('eq') eq:string,
    @Query('startDate') startDate:string,
    ): Promise<number[]> {       
     return await this.ecg_byteService.getEcg(eq,startDate);
   }
 
   @Get("/EcgTime")
   async getEcgTime(
   @Query('eq') eq:string,
   @Query('startDate') startDate:string,
   @Query('endDate') endDate:string,
   ):Promise<string[]>{
     return await this.ecg_byteService.getEcgTime(eq,startDate,endDate);
   }
 
   @Get("/GraphEcg")
  async getGraphEcg(       
    @Query('eq') eq:string,
    @Query('startDate') startDate:string,
    @Query('endDate') endDate:string,
    ): Promise<number[]> {       
     return await this.ecg_byteService.getGraphEcgValue(eq,startDate,endDate);
   }

}