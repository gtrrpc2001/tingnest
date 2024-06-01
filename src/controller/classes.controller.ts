import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClassesDTO } from 'src/dto/classes.dto';
import { ClassesService } from 'src/service/classes.service';

@Controller('class')
@ApiTags('class')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

    @Post("/api_data")
   async postAll(
     @Body() body: ClassesDTO) {
      return await this.classesService.gubunKind(body);
    }

  //   @Get("/api_getdata")
  //  async getBpm(
  //    @Query('eq') eq:string,
  //    @Query('startDate') startDate:string,
  //    @Query('endDate') endDate:string
  //    ): Promise<string> {
  //     return await this.ecg_csv_bpmdayService.BpmData(eq,startDate,endDate);
  //   }

  //   @Get("/webBpm")
  //  async getWebBpm(
  //    @Query('eq') eq:string,
  //    @Query('startDate') startDate:string,
  //    @Query('endDate') endDate:string): Promise<string> {
  //     return await this.ecg_csv_bpmdayService.getWebBpm(eq,startDate,endDate);
  //   }

  //   @Get("/webGraphBpmHrvArr")
  //  async getTest(
  //    @Query('eq') eq:string,
  //    @Query('startDate') startDate:string,
  //    @Query('endDate') endDate:string): Promise<any> {
  //     return await this.ecg_csv_bpmdayService.webGraphBpmHrvArr(eq,startDate,endDate);
  //   }
}
