import { Controller, Get, Post, Body, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDTO } from '../dto/user.dto';
import { UserService } from 'src/service/user.service';
import { Response } from 'express';
import { commonFun } from 'src/clsfunc/commonfunc';
import { ConfigService } from '@nestjs/config';


@Controller('ting')
@ApiTags('ting')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private config:ConfigService
    ) {}

  @Post('/api_getdata')
  async postAll(@Body() body: UserDTO): Promise<any> {
    return await this.userService.gubunKind(body);
  }

  @Get('/mapProfiles')
  async sendImageFile(@Res() res: Response, @Query('idx') idx: number) {
    await this.userService.sendProfile(res, idx);
  }

  @Get('/test')
  async test() {    
    const path = this.config.get<string>('DEFAULT_PROFILE_IMAGE_PATH')
    const profile = await commonFun.getDefault_ImageAsBase64(path)
    return profile
  }
  
}
