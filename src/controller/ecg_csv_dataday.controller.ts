import { Controller, Get,Post,Body,Query} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ecg_csv_datadayService } from 'src/service/ecg_csv_dataday.service';

@Controller('mslecgday')
@ApiTags('mslecgday')
export class ecg_csv_datadayController {
  constructor(private readonly ecg_csv_datadayService: ecg_csv_datadayService) {}  

//   @Post("/api_getdata")
//  async postAll(    
//    @Body() body: ecg_csv_ecgdataDTO): Promise<any> {         
//     return await this.ecg_csv_datadayService.gubunKind(body);
//   }

//   @Get("/day")
//  async getMonthly(       
//    @Query('eq') eq:string,
//    @Query('startDate') startDate:string,
//    @Query('endDate') endDate:string): Promise<string> {       
//     return await this.ecg_csv_datadayService.getDay('calandDistanceData',eq,startDate,endDate);
//   }

//   @Get("/webDay")
//  async getWebDayData(       
//    @Query('eq') eq:string,
//    @Query('startDate') startDate:string,
//    @Query('endDate') endDate:string,
//    @Query('len') len:number): Promise<string> {       
//     return await this.ecg_csv_datadayService.getWebSumDayData(eq,startDate,endDate,len);
//   }

//   @Get("/test")
//  async getTest(       
//    @Query('eq') eq:string,
//    @Query('startDate') startDate:string): Promise<any> {       
//     return ''//await this.ecg_csv_datadayService.webGraphBpmHrvArr(eq,startDate);
//   }

}