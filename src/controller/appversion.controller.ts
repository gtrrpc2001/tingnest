import { Controller, Get,Post,Body,Query} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppversionDTO } from 'src/dto/appversion.dto';
import { AppversionService } from 'src/service/appversion.service';

@Controller('appversion')
@ApiTags('appversion')
export class AppversionController {
  constructor(private readonly appversionService: AppversionService) {}  

  @Post("/api_getdata")
 async api_getdata(    
   @Body() body: AppversionDTO): Promise<string> {        
    return await this.appversionService.updateVersion(body);
  }

  @Get("/getVersion")
 async getVersion(       
   @Query('admin') admin:string
   ): Promise<string> {       
    return await this.appversionService.getVersion(admin);
  }
}