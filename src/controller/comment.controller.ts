import { Controller, Get,Post,Body,Query} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentService } from 'src/service/comment.service';

@Controller('comment')
@ApiTags('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}  

//   @Post("/api_getdata")
//  async postAll(    
//    @Body() body: ecg_csv_ecgdataDTO): Promise<any> {        
//     //return await this.ecg_csv_ecgdata_arrService.gubunKind(body);
//     return ''
//   }

  @Get("/arrEcgData")
 async getArrEcgData(       
   @Query('eq') eq:string,
   @Query('startDate') startDate:string,
   @Query('endDate') endDate:string): Promise<string> {       
    //return await this.ecg_csv_ecgdata_arrService.arrEcgData(eq,startDate,endDate);
    return ''
  }

  @Get("/arrWritetime")
 async getArrWritetime(         
  @Query('eq') eq:string,
  @Query('startDate') startDate:string,
  @Query('endDate') endDate:string): Promise<any> {       
    //return await this.ecg_csv_ecgdata_arrService.arrWritetime(eq,startDate,endDate);
    return ''
  }

  @Get("/test")
 async getTest(   
  @Query('idx') idx:number,    
  @Query('eq') eq:string,
  @Query('startDate') startDate:string,
  @Query('endDate') endDate:string): Promise<any> {       
    //return await this.ecg_csv_ecgdata_arrService.testArr(idx,eq,startDate,endDate);
    return ''
  }

  @Get("/arrCount")
 async getOnlyArrCount(   
  @Query('eq') eq:string,
  @Query('startDate') startDate:string,
  @Query('endDate') endDate:string): Promise<any> {       
    //return await this.ecg_csv_ecgdata_arrService.onlyArrCount(eq,startDate,endDate);
    return ''
  }

  @Get("/arrCnt")
 async getCount(   
  @Query('eq') eq:string,
  @Query('startDate') startDate:string,
  @Query('endDate') endDate:string): Promise<any> {       
    //return await this.ecg_csv_ecgdata_arrService.countArr(eq,startDate,endDate);
    return ''
  }

  @Get("/graphArrCnt")
 async getGraphArrCount(   
  @Query('eq') eq:string,
  @Query('startDate') startDate:string,
  @Query('endDate') endDate:string,
  @Query('len') len:number
  ): Promise<any> {       
    //return await this.ecg_csv_ecgdata_arrService.graphArrCount(eq,startDate,endDate,len);
    return ''
  }

  @Get("/arrPreEcgData")
 async getArrPreEcgData(   
  @Query('eq') eq:string,
  @Query('date') date:string): Promise<any> {       
    //return await this.ecg_csv_ecgdata_arrService.arrPreEcgData(eq,date);
    return ''
  }
}