import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cmt_cmtEntity, CommentEntity } from 'src/entity/comment.entity';
import { CmtDTO, CommentDTO } from 'src/dto/comment.dto';
import { CommentImgService } from './commentimg.service';
import { ConfigService } from '@nestjs/config';
import * as dayjs from 'dayjs';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(Cmt_cmtEntity)
    private cmt_cmtRepository: Repository<Cmt_cmtEntity>,
    private commentImgService: CommentImgService,
    private config: ConfigService,
  ) { }

  use: number = this.config.get<number>('USE');
  pause: number = this.config.get<number>('PAUSE');

  async CommentInsert(body: CommentDTO) {
    try {
      const value = {
        id: body.id,
        useridx: body.useridx,
        postNum: body.postNum,
        aka: body.aka,
        content: body.content,
        isImg: Number(body.img ? this.use : this.pause),
      };
      const result = await this.commentRepository
        .createQueryBuilder()
        .insert()
        .into(CommentEntity)
        .values([value])
        .execute();
      let values
      if (body.img && result.identifiers.length > 0) {
        values = await this.getCmtcmtOrCommentInsertWithImage(
          result,
          value,
          body,
        );
      } else if (result.identifiers.length > 0) {
        values = await this.getCmtcmtOrCommentInsertWithoutImage(result, value);
      }
      console.log('CommentInsert');
      return values;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async getComment(postNum: number, userId: string): Promise<CommentEntity[]> {
    try {
      const result: CommentEntity[] = await this.commentRepository
        .createQueryBuilder()
        .select('*')
        .where({ postNum: postNum })
        .andWhere({ pause: this.use })
        .orderBy('writetime', 'DESC')
        .getRawMany();
      const values = this.Sort_CommentWithCmt(result, userId);
      console.log('getComment');
      return values;
    } catch (E) {
      console.log(E);
    }
  }

  async getComments(commentNums: number, userId: string): Promise<CmtDTO[]> {
    try {
      const result = await this.cmt_cmtRepository
        .createQueryBuilder()
        .select('*')
        .where({ commentNum: commentNums })
        .andWhere({ pause: this.use })
        .orderBy('writetime', 'DESC')
        .getRawMany();
      const values = this.Sort_CommentWithCmt(result, userId);
      console.log('getComments');
      return values
    } catch (E) {
      console.log(E);
      return [];
    }
  }

  Sort_CommentWithCmt(result: any[], userId: string) {
    const equalId = [];
    const otherIds = [];

    for (const value of result) {
      if (value.id === userId) {
        equalId.push(value);
      } else {
        otherIds.push(value);
      }
    }
    return [...equalId, ...otherIds];
  }


  async CommentUpdate(body: CommentDTO): Promise<boolean | { msg: string }> {
    try {
      const result = await this.commentRepository
        .createQueryBuilder()
        .update(CommentEntity)
        .set({
          content: body.content,
          writetime: body.writetime,
        })
        .where({ idx: body.idx })
        .execute();
      if (body.img) {
        const imgResult = await this.commentImgService.UpdateCommentImg(body);
        return imgResult;
      }
      return result.affected > 0;
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  async UpdateCmtcmt(body: CmtDTO): Promise<boolean | { msg: string }> {
    try {
      const result = await this.cmt_cmtRepository
        .createQueryBuilder()
        .update(Cmt_cmtEntity)
        .set({
          content: body.content,
          writetime: body.writetime,
        })
        .where({ idx: body.idx })
        .execute();
      if (body.img) {
        const imgResult = await this.commentImgService.UpdateCmt_cmtImg(body);
        return imgResult;
      }
      return result.affected > 0;
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  async CommentDelete(commentidx: number): Promise<boolean> {
    try {
      const result = await this.commentRepository
        .createQueryBuilder()
        .update(CommentEntity)
        .set({ pause: this.pause })
        .where({ idx: commentidx })
        .execute();
      if (result.affected > 0) {
        const deleteResult = await this.DeleteCmt_cmtFromComment(commentidx);
        return deleteResult;
      }
      return false;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async DeleteCommentFromNbo(nboidx: number): Promise<boolean> {
    try {
      const result = await this.commentRepository
        .createQueryBuilder()
        .update(CommentEntity)
        .set({ pause: this.pause })
        .where({ postNum: nboidx })
        .execute();
      if (result.affected > 0) {
        const deleteResult = await this.DeleteCmt_cmtFromNbo(nboidx);
        return deleteResult;
      }
      return false;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async DeleteCmt_cmt(body: CmtDTO) {
    try {
      const result = await this.cmt_cmtRepository
        .createQueryBuilder()
        .update(Cmt_cmtEntity)
        .set({ pause: this.pause })
        .where({ idx: body.idx })
        .execute();
      if (result.affected > 0) {
        const deleteResult = await this.DeleteCmt_cmtFromComment(body.idx);
        return deleteResult;
      }
      return { msg: 0 };
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  async DeleteCmt_cmtFromComment(commentNum: number): Promise<boolean> {
    try {
      const result = await this.cmt_cmtRepository
        .createQueryBuilder()
        .update(Cmt_cmtEntity)
        .set({ pause: this.pause })
        .where({ commentNum: commentNum })
        .execute();
      return result.affected > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async DeleteCmt_cmtFromNbo(nboNum: number): Promise<boolean> {
    try {
      const result = await this.cmt_cmtRepository
        .createQueryBuilder()
        .update(Cmt_cmtEntity)
        .set({ pause: this.pause })
        .where({ nboNum: nboNum })
        .execute();
      return result.affected > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async InsertCmt_cmt(body: CmtDTO) {
    try {
      const value = {
        id: body.id,
        useridx: body.useridx,
        nboNum: body.nboNum,
        commentNum: body.commentNum,
        aka: body.aka,
        content: body.content,
        isImg: Number(body.img ? this.use : this.pause),
      };
      const result = await this.commentRepository
        .createQueryBuilder()
        .insert()
        .into(Cmt_cmtEntity)
        .values([value])
        .execute();

      let values;
      if (body.img && result.identifiers.length > 0) {
        values = await this.getCmtcmtOrCommentInsertWithImage(
          result,
          value,
          body,
          body.commentNum,
        );
      } else if (result.identifiers.length > 0) {
        values = await this.getCmtcmtOrCommentInsertWithoutImage(
          result,
          value,
          body.commentNum,
        );
      }
      console.log('InsertCmt_cmt');
      return values;
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  async getCmtcmtOrCommentInsertWithImage(
    result: any,
    value: any,
    body: any,
    commentNum?: number,
  ) {
    const idx: number = result.identifiers[0].idx;
    const writetime = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    const imgResult = commentNum
      ? await this.commentImgService.InsertCmt_cmtImg(body, idx)
      : await this.commentImgService.InsertCommentImg(body, idx);
    if (imgResult) {
      if (commentNum) {
        const commentResult = await this.UpdateCommentes(body.commentNum);
        const values = {
          idx: idx,
          writetime: writetime,
          ...value,
        };
        return commentResult ? (values as Cmt_cmtEntity) : {};
      }

      const values = {
        idx: idx,
        writetime: writetime,
        ...value,
      };
      return values as CommentEntity;
    }
  }

  async getCmtcmtOrCommentInsertWithoutImage(
    result: any,
    value: any,
    commentNum?: number,
  ) {
    const idx: number = result.identifiers[0].idx;
    const writetime = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    if (commentNum) {
      const commentResult = await this.UpdateCommentes(commentNum);
      const values = {
        idx: idx,
        writetime: writetime,
        ...value,
      };
      return commentResult ? (values as Cmt_cmtEntity) : {};
    }
    const values = {
      idx: idx,
      writetime: writetime,
      ...value,
    };
    return values as CommentEntity;
  }

  async UpdateCommentes(idx: number): Promise<boolean> {
    try {
      const result = await this.commentRepository
        .createQueryBuilder()
        .update(CommentEntity)
        .set({ commentes: () => 'commentes + 1' })
        .where({ idx: idx })
        .execute();

      console.log('UpdateCommentes');
      return result.affected > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }
}
