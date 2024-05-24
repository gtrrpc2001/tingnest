import { Controller, Get, Post, Body, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDTO } from '../dto/user.dto';
import { UserService } from 'src/service/user.service';
import { Response } from 'express';
import { PositionManager } from 'src/manager/position.manager';
import { rect } from 'src/interface/Position';

@Controller('ting')
@ApiTags('ting')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/api_getdata')
  async postAll(@Body() body: UserDTO): Promise<any> {
    return await this.userService.gubunKind(body);
  }

  @Get('/mapProfiles')
  async sendImageFile(@Res() res: Response, @Query('idx') idx: number) {
    await this.userService.sendProfile(res, idx);
  }

  @Get('/test')
  test() {
    var test = new PositionManager();
    var points: rect[] = [
      { lat: 38.040838495349185, lng: 128.71375654039565 },
      { lat: 38.040838495349185, lng: 128.73285168853545 },
      { lat: 38.01437860481994, lng: 128.73285168853545 },
      { lat: 38.01437860481994, lng: 128.71375654039565 },
    ];
    return test.checkIsPointInRectangle({ lat: 38.025, lng: 128.72 }, points);
  }
}
