import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LikesDTO } from 'src/dto/likes.dto';
import { LikesService } from 'src/service/likes.service';

@Controller('likes')
@ApiTags('likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @Post('/api_getdata')
  async postAll(@Body() body: LikesDTO): Promise<boolean> {
    return await this.likesService.gubunKind(body);
  }
}
