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
      const img = commonFun.getImageBuffer(body.img[0])      
      console.log(img)
      const result = await this.commentImgRepository
        .createQueryBuilder()
        .insert()
        .into(CommentImgEntity)
        .values([
          {
            id: body.id,
            commentidx: idx,
            commentImg: img,
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

  async test(body: CommentDTO): Promise<boolean> {
    try {         
      console.log(body.img)
      const img = commonFun.getImageBuffer(body.img[0])
      const result = await this.commentImgRepository
        .createQueryBuilder()
        .update(CommentImgEntity)
        .set({
          commentImg: img
        })
        .where({id: body.id})
        .andWhere({commentidx: body.idx})
        .execute();
      console.log('test');
      return result.affected > 0;
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
      const img = commonFun.getImageBuffer(body.img[0])  
      const result = await this.cmt_cmtImgRepository
        .createQueryBuilder()
        .insert()
        .into(Cmt_cmtImgEntity)
        .values([
          {
            id: body.id,
            commentidx: idx,
            commentImg: img,
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

  async DeleteCommentImg(commentidx?: number,cmtCmtidx?:number): Promise<boolean> {
    try {
      if(commentidx){
        const commentImg = await this.selectCommentImg(commentidx);
        if(commentImg) {       
          const result = await this.InsertCommentImgLog(commentImg, commentidx);
          if (result) {
            const result = await this.Commentdelete(commentidx);
            return result;
          } else {
            return false;
          }
        }else{
          return true;
        }
      }else{
        const cmtImg = await this.selectCmtImg(cmtCmtidx);
        if(cmtImg) {       
          const result = await this.InsertCmtImgLog(cmtImg, cmtCmtidx);
          if (result) {
            const result = await this.Cmtdelete(cmtCmtidx);
            return result;
          } else {
            return false;
          }
        }else{
          return true;
        }
      }
    } catch (E) {
      console.log('DeleteNboImg : ' + E);
      return false;
    }
  }

  async selectCommentImg(commentidx: number): Promise<CommentImgEntity> {
    try {
      const result: CommentImgEntity = await this.commentImgRepository
        .createQueryBuilder()
        .select('*')
        .where({ commentidx: commentidx })
        .getRawOne();
      console.log('selectCommentImg');
      return result;
    } catch (E) {
      console.log('selectCommentImg : ' + E);
    }
  }

  async selectCmtImg(commentidx: number): Promise<Cmt_cmtImgEntity> {
    try {
      const result: Cmt_cmtImgEntity = await this.cmt_cmtImgRepository
        .createQueryBuilder()
        .select('*')
        .where({ commentidx: commentidx })
        .getRawOne();
      console.log('selectCmtImg');
      return result;
    } catch (E) {
      console.log('selectCmtImg : ' + E);
    }
  }

  async Commentdelete(commentidx: number): Promise<boolean> {
    try {
      const result = await this.commentImgRepository
        .createQueryBuilder()
        .delete()
        .where({ commentidx: commentidx })
        .execute();
      return result.affected > 0;
    } catch (E) {
      console.log('Commentdelete : ' + E);
      return false;
    }
  }

  async Cmtdelete(commentidx: number): Promise<boolean> {
    try {
      const result = await this.cmt_cmtImgRepository
        .createQueryBuilder()
        .delete()
        .where({ commentidx: commentidx })
        .execute();
      return result.affected > 0;
    } catch (E) {
      console.log('Cmtdelete : ' + E);
      return false;
    }
  }

  async InsertCommentImgLog(body: CommentImgEntity, idx: number): Promise<boolean> {
    try {
      const result = await this.commentImgRepository
        .createQueryBuilder()
        .insert()
        .into(CommentImgLogEntity)
        .values([
          {
            id: body.id,
            commentidx: idx,
            commentImg: body.commentImg,
            writetime: body.writetime,
          },
        ])
        .execute();
      return result.identifiers.length > 0;
    } catch (E) {
      console.log('InsertImgLog : ' + E);
      return false;
    }
  }

  async InsertCmtImgLog(body: Cmt_cmtImgEntity, idx: number): Promise<boolean> {
    try {
      const result = await this.commentImgRepository
        .createQueryBuilder()
        .insert()
        .into(Cmt_cmtImgLogEntity)
        .values([
          {
            id: body.id,
            commentidx: idx,
            commentImg: body.commentImg,
            writetime: body.writetime,
          },
        ])
        .execute();
      return result.identifiers.length > 0;
    } catch (E) {
      console.log('InsertCmtImgLog : ' + E);
      return false;
    }
  }   
}
