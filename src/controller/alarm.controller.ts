import { Controller, Get,Post,Body,Query} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { firebasenoti } from 'src/alarm/firebasenoti';
import { AlarmDTO } from 'src/dto/alarm.dto';
import { AlarmService } from 'src/service/alarm.service';

@Controller('alarm')
@ApiTags('alarm')
export class AlarmController {
  constructor(
    private alarmService:AlarmService
  ) {}  

  @Post("/api_getdata")
 async postAll(    
   @Body() body: AlarmDTO): Promise<boolean> {         
    return await this.alarmService.gubunKind(body);
  }
}