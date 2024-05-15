import { Controller, Get,Post,Body,Query} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAccessStrategy } from 'src/jwt/jwtAccessStrategy';
import { app_bleService } from 'src/service/app_ble.service';

@Controller('app_ble')
@ApiTags('app_ble')
export class app_bleController {
  constructor(private readonly app_bleService: app_bleService) {}  

  @Post("/api_getdata")
 async postLog(    
   @Body() body: any): Promise<any> {        
    return await this.app_bleService.LogInsert(body);
  }  

  @Get("/test")
  getTest():string{    
    return''
  }

}