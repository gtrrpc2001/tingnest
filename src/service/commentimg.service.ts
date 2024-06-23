import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NboImgEntity, nboImgLogEntity } from 'src/entity/nboImg.entity';
import { NboImgDTO } from 'src/dto/nboimg.dto';
import { commonFun } from 'src/clsfunc/commonfunc';
import { Response } from 'express';
import {
  Cmt_cmtImgEntity,
  Cmt_cmtImgLogEntity,
  CommentImgEntity,
  CommentImgLogEntity,
} from 'src/entity/comment_img.entity';
import { CmtDTO, CommentDTO } from 'src/dto/comment.dto';

@Injectable()
export class CommentImgService {
  constructor(
    @InjectRepository(CommentImgEntity)
    private commentImgRepository: Repository<CommentImgEntity>,
    @InjectRepository(CommentImgLogEntity)
    private commentImgLogRepository: Repository<CommentImgLogEntity>,
    @InjectRepository(Cmt_cmtImgEntity)
    private cmt_cmtImgRepository: Repository<Cmt_cmtImgEntity>,
    @InjectRepository(Cmt_cmtImgLogEntity)
    private cmt_cmtImgLogRepository: Repository<Cmt_cmtImgLogEntity>,
  ) {}

  async InsertCommentImg(body: CommentDTO, idx: number): Promise<boolean> {
    try {
      const result = await this.commentImgRepository
        .createQueryBuilder()
        .insert()
        .into(CommentImgEntity)
        .values([
          {
            id: body.id,
            commentidx: idx,
            commentImg: body.img,
          },
        ])
        .execute();
      console.log('InsertCommentImg');
      return result.identifiers.length > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async sendCommentImg(res: Response,idx: number) {
    try {
      const result: CommentImgEntity = await this.commentImgRepository
        .createQueryBuilder()
        .select('commentImg')
        .where({ commentidx: idx })
        .getRawOne();

      if (result.commentImg) {
        commonFun.ResponseImage(res, result.commentImg);
      }
      return result;
    } catch (E) {
      console.log(E);
    }
  }

  async sendCmtcmtImg(res: Response,idx: number) {
    try {
      const result: Cmt_cmtImgEntity = await this.cmt_cmtImgRepository
        .createQueryBuilder()
        .select('commentImg')
        .where({ commentidx: idx })
        .getRawOne();

      if (result.commentImg) {
        commonFun.ResponseImage(res, result.commentImg);
      }
      return result;
    } catch (E) {
      console.log(E);
    }
  }

  async InsertCmt_cmtImg(body: CmtDTO, idx: number): Promise<boolean> {
    try {
      const result = await this.cmt_cmtImgRepository
        .createQueryBuilder()
        .insert()
        .into(CommentImgEntity)
        .values([
          {
            id: body.id,
            commentidx: idx,
            commentImg: body.img,
          },
        ])
        .execute();
      console.log('InsertCmt_cmtImg');
      return result.identifiers.length > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async InsertCommentImg_Log(body: CommentImgEntity): Promise<boolean> {
    try {
      const result = await this.commentImgLogRepository
        .createQueryBuilder()
        .insert()
        .into(CommentImgLogEntity)
        .values([
          {
            id: body.id,
            commentidx: body.idx,
            commentImg: body.commentImg,
          },
        ])
        .execute();
      console.log('InsertCommentImg_Log');
      return result.identifiers.length > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async InsertCmt_cmtImg_Log(body: Cmt_cmtImgEntity): Promise<boolean> {
    try {
      const result = await this.commentImgLogRepository
        .createQueryBuilder()
        .insert()
        .into(Cmt_cmtImgEntity)
        .values([
          {
            id: body.id,
            commentidx: body.idx,
            commentImg: body.commentImg,
          },
        ])
        .execute();
      console.log('InsertCmt_cmtImg_Log');
      return result.identifiers.length > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async SelectCommentImg_Info(idx: number): Promise<CommentImgEntity> {
    try {
      const result: CommentImgEntity = await this.commentImgRepository
        .createQueryBuilder()
        .select('*')
        .where({ idx: idx })
        .getRawOne();
      return result;
    } catch (E) {
      console.log(E);
      return null;
    }
  }

  async SelectCmt_cmtImg_Info(idx: number): Promise<CommentImgEntity> {
    try {
      const result: Cmt_cmtImgEntity = await this.cmt_cmtImgRepository
        .createQueryBuilder()
        .select('*')
        .where({ idx: idx })
        .getRawOne();
      return result;
    } catch (E) {
      console.log(E);
      return null;
    }
  }

  async UpdateCommentImg(body: CommentDTO): Promise<boolean> {
    try {
      const imgEntity = await this.SelectCommentImg_Info(body.idx);
      const logResult = await this.InsertCommentImg_Log(imgEntity);
      if (logResult) {
        const result = await this.commentImgRepository
          .createQueryBuilder()
          .update(CommentImgEntity)
          .set({
            commentImg: body.img,
            writetime: body.writetime,
          })
          .where({ idx: body.idx })
          .execute();
        return result.affected > 0;
      }
      return false;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async UpdateCmt_cmtImg(body: CmtDTO): Promise<boolean> {
    try {
      const imgEntity = await this.SelectCmt_cmtImg_Info(body.idx);
      const logResult = await this.InsertCmt_cmtImg_Log(imgEntity);
      if (logResult) {
        const result = await this.cmt_cmtImgRepository
          .createQueryBuilder()
          .update(Cmt_cmtImgEntity)
          .set({
            commentImg: body.img,
            writetime: body.writetime,
          })
          .where({ idx: body.idx })
          .execute();
        return result.affected > 0;
      }
      return false;
    } catch (E) {
      console.log(E);
      return false;
    }
  }
}
