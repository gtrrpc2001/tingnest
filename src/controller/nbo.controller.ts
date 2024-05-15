import { Controller, Get,Post,Body,Query} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NboService } from 'src/service/nbo.service';
import { NboDTO } from '../dto/nbo.dto';

@Controller('nbo')
@ApiTags('nbo')
export class nboController {
  constructor(private readonly nboService: NboService) {}  

  @Post("/api_getdata")
 async postAll(    
   @Body() body: NboDTO): Promise<any> {        
    //return await this.ecg_raw_history_lastService.gubunKind(body);
    return ''
  }

  @Get("/last")
 async getLast(       
   @Query('eq') eq:string): Promise<string> {       
    //return await this.ecg_raw_history_lastService.getEcg_raw_history_last(eq);
    return ''
  }

  @Get("/webTable")
 async getTableListValue(
 ): Promise<any> {       
    //return await this.ecg_raw_history_lastService.gethistory_last();
    return ''
  }

}