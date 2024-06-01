import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NboService } from 'src/service/nbo.service';
import { NboDTO } from '../dto/nbo.dto';

@Controller('nbo')
@ApiTags('nbo')
export class nboController {
  constructor(private readonly nboService: NboService) {}

  @Post('/api_getdata')
  async postAll(@Body() body: NboDTO): Promise<any> {
    return await this.nboService.gubunKind(body);
  }

  @Get('/nboSelect')
  async getLast(
    @Query('limit') limit: number,
    @Query('id') id?: string,
    @Query('keyword') keyword?: string,
    @Query('idx') idx?: number,
    @Query('search') search?: string,
    ): Promise<any> {    
    return await this.nboService.getSelectNboInfo(id,keyword,limit,idx,search);
  }

  @Get('/webTable')
  async getTableListValue(): Promise<any> {
    //return await this.ecg_raw_history_lastService.gethistory_last();
    return '';
  }
}
