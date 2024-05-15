import { Controller, Get,Post,Body,Query} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PositionService } from 'src/service/position.service';
import { PositionDTO } from '../dto/position.dto';


@Controller('position')
@ApiTags('position')
export class PositionController {
  constructor(
    // private readonly positionService: PositionService,    
    ) {}  

  @Post("/api_getdata")
 async InsertPosition(    
   @Body() body: PositionDTO): Promise<any> {     
    // return await this.positionService.InsertPosition(body);    
  }
  
}