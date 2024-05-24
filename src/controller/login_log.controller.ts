import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Login_logDTO } from 'src/dto/Login_log.dto';
import { Login_logService } from 'src/service/login_log.service';

@Controller('Login_log')
@ApiTags('Login_log')
export class Login_logController {
  constructor(private readonly login_logService: Login_logService) {}

  @Post('/api_getdata')
  async postLog(@Body() body: Login_logDTO): Promise<any> {
    return await this.login_logService.LogInsert(body);
  }
}
