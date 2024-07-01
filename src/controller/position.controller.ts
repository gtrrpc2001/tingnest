import { Controller, Get, Post, Body, Query, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PositionService } from 'src/service/position.service';
import { PositionDTO } from '../dto/position.dto';

@Controller('position')
@ApiTags('position')
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Put('/visibleUpdate')
  async visibleUpdate(@Body() body: PositionDTO): Promise<any> {
    return await this.positionService.updateVisible(body);
  }

  @Get('/test')
  async test(@Query() id: string){
    return await this.positionService.GetUserPosition(id);
  }
}
