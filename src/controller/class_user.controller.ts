import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Class_userService } from 'src/service/class_user.service';

@Controller('class_user')
@ApiTags('class_user')
export class Class_userController {
  constructor(private readonly class_userService: Class_userService) {}

  @Post('/api_getdata')
  async postLog(@Body() body: any): Promise<any> {
    return await this.class_userService.Insert_ClassUser(body);
  }

  @Get('/test')
  getTest(): string {
    return '';
  }
}
