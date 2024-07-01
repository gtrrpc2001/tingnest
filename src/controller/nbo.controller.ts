import { Controller, Get, Post, Body, Query, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NboService } from 'src/service/nbo.service';
import { NboDTO } from '../dto/nbo.dto';
import { subject } from 'src/interface/nbo.subject';
import { NboImgService } from 'src/service/nboimg.service';
import { Response } from 'express';
import { CmtDTO, CommentDTO } from 'src/dto/comment.dto';
import { CommentService } from 'src/service/comment.service';
import { CommentImgService } from 'src/service/commentimg.service';

@Controller('nbo')
@ApiTags('nbo')
export class nboController {
  constructor(
    private readonly nboService: NboService,
    private readonly nboImgService: NboImgService,
    private readonly commentService:CommentService,
    private readonly commentImgService:CommentImgService
  ) {}

  @Post('/api_post')
  async postAll(@Body() body: NboDTO): Promise<any> {
    return await this.nboService.NboGubunKind(body);
  }

  @Post('/api_commentPost')
  async commentPost(@Body() body: CommentDTO): Promise<any> {
    return await this.nboService.commentGubunKind(body);
  }

  @Post('/api_cmtCmtPost')
  async cmtCmtPost(@Body() body: CmtDTO): Promise<any> {
    return await this.nboService.cmtCmtGubunKind(body);
  }

  @Get('/nboSelect')
  async getSelect(
    @Query('limit') limit: number,
    @Query('id') id: string,
    @Query('keyword') keyword?: string,
    @Query('idx') idx?: number,
    @Query('search') search?: string,
    @Query('mine') mine?:number
  ): Promise<any> {
    return await this.nboService.getSelectNboInfo(
      id,
      keyword,
      limit,
      idx,
      search,
      mine
    );
  }

  @Get('/nboClick')
  async getClick(@Query('idx') idx: number, @Query('id') id: string) {
    const result = await this.nboService.Add_NboViews(idx, id);
    return await this.nboService.ClickNbo(idx,id);
  }

  @Get('/nboImgFirstSelect')
  async getImgFirstSelect(
    @Res() res: Response,
    @Query('nboidx') nboidx: number,
  ): Promise<any> {
    return await this.nboImgService.sendFirstImg(res, nboidx);
  }

  @Get('/nboImgSelect')
  async getNboImgSelect(
    @Res() res: Response,
    @Query('imgIdx') idx: number,
  ): Promise<any> {
    return await this.nboImgService.sendImg(res, idx);
  }

  @Get('/commentImgSelect')
  async getCommentImgSelect(
    @Res() res: Response,
    @Query('imgIdx') idx: number,
  ): Promise<any> {
    return await this.commentImgService.sendCommentImg(res, idx);
  }

  @Get('/cmtCmtImgSelect')
  async getCmtcmtImgSelect(
    @Res() res: Response,
    @Query('imgIdx') idx: number,
  ): Promise<any> {
    return await this.commentImgService.sendCmtcmtImg(res, idx);
  }

  @Get('/nbo_Subject')
  async getSubject(@Query('length') length: number): Promise<string[]> {
    console.log(length)
    if (subject.length != length) {
      return subject;
    } else {
      return [];
    }
  }

  @Get('/test')
  async test(@Query('parentId') parentId: number[],@Query('userid') userid:string){
    return await this.commentService.getCommentsByParentIds(parentId,userid)
  }
}
