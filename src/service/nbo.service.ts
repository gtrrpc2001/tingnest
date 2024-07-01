import { NboEntity, NboLogEntity } from 'src/entity/nbo.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, MoreThan, LessThan, In } from 'typeorm';
import { NboImgService } from './nboimg.service';
import { CommentService } from './comment.service';
import { NboDTO } from 'src/dto/nbo.dto';
import { NboInterface } from 'src/interface/nbo';
import { CmtDTO, CommentDTO } from 'src/dto/comment.dto';
import { ConfigService } from '@nestjs/config';
import { NboViewsEntity } from 'src/entity/nbo_views.entity';
import { NboSearchEntity } from 'src/entity/nbo_search.entity';

@Injectable()
export class NboService {
  constructor(
    @InjectRepository(NboEntity) private nboRepository: Repository<NboEntity>,
    @InjectRepository(NboSearchEntity)
    private nboSearchRepository: Repository<NboSearchEntity>,
    @InjectRepository(NboViewsEntity)
    private nboViewsRepository: Repository<NboViewsEntity>,
    @InjectRepository(NboLogEntity)
    private nboLogRepository: Repository<NboLogEntity>,
    private nboImgService: NboImgService,
    private commentService: CommentService,
    private config: ConfigService,
  ) {}

  pause = Number(this.config.get<number>('PAUSE'));
  use = Number(this.config.get<number>('USE'));
  private select =
    'idx,writetime,useridx,aka,likes,vilege,subject,title,content,isImg,commentes';

  async NboGubunKind(body: NboDTO): Promise<any> {
    switch (body.kind) {
      case 'nboInsert':
        return await this.InsertNbo(body);
      case 'nboDelete':
        return await this.DeleteNbo(body.idx);
      case 'nboUpdate':
        return await this.UpdateNbo(body);
      case 'nboOnlyImgDelete':
        // img 수정 해서 이미지 다 제거 했을때
        return await this.nboImgService.DeleteNboImg(body.idx);
      case null:
        return false;
    }
  }

  async commentGubunKind(body: CommentDTO) {
    switch (body.kind) {
      case 'commentInsert':
        return await this.commentInsert(body);
      case 'commentDelete':
        return await this.commentDelete(body);
    }
  }

  async cmtCmtGubunKind(body: CmtDTO) {
    switch (body.kind) {
      case 'cmtCmtInsert':
        const result = await this.commentService.InsertCmt_cmt(body);
        if (result) {
          const updateResult = await this.updateCommentesPlusNbo(body.nboNum);
          if (updateResult) return result;
        }
        return { msg: 0 };
      case 'cmtCmtDelete':
        const deleteResult = await this.commentService.DeleteCmt_cmt(body);
        if (deleteResult) {
          const minusCommentes = await this.updateCommentesMinusNbo(
            body.nboNum,
          );
          return minusCommentes;
        }
        return { msg: 0 };
    }
  }

  async Add_NboViews(nboIdx: number, userId: string): Promise<boolean> {
    try {
      let result = await this.UpdateNbo_Views(nboIdx);

      if (result) {
        result = await this.InsertNbo_Views(nboIdx, userId);
      }
      return result;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async UpdateNbo_Views(nboIdx: number): Promise<boolean> {
    try {
      let result = await this.nboRepository
        .createQueryBuilder()
        .update(NboEntity)
        .set({ views: () => 'views + 1' })
        .where({ idx: nboIdx })
        .execute();
      return result.affected > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async InsertNbo_Views(nboIdx: number, userId: string): Promise<boolean> {
    try {
      const result = await this.nboViewsRepository
        .createQueryBuilder()
        .insert()
        .into(NboViewsEntity)
        .values([
          {
            id: userId,
            nboidx: nboIdx,
          },
        ])
        .execute();
      return result.identifiers.length > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async commentDelete(body: CommentDTO) {
    try {
      let result = false;
      const deleteResult = await this.commentService.CommentDelete(body.idx);
      if (deleteResult) {
        result = await this.updateCommentesMinusNbo(
          body.postNum,
          body.commentes,
        );
      }
      return result;
    } catch (E) {
      console.log('commentDelete ', E);
      return { msg: E };
    }
  }

  async DeleteCommentFromNbo(nboidx: number) {
    try {
      let result = false;
      const deleteResult =
        await this.commentService.DeleteCommentFromNbo(nboidx);
      if (deleteResult) {
        result = await this.updateCommentesMinusNbo(nboidx);
      }
      return result;
    } catch (E) {
      console.log('commentDelete ', E);
      return false;
    }
  }

  async commentInsert(body: CommentDTO) {
    try {
      let result = false;
      const commentResult = await this.commentService.CommentInsert(body);
      if (commentResult) {
        result = await this.updateCommentesPlusNbo(body.postNum);
        return commentResult;
      }
      return { msg: 0 };
    } catch (E) {
      console.log('commentInsert ', E);
      return { msg: E };
    }
  }

  async getSelectNboInfo(
    id: string,
    keyword: string,
    limit: number,
    idx: number,
    search: string,
    mine: number,
  ) {
    try {
      let result: NboEntity[];
      console.log('check : ', mine);
      if (mine) {
        result = await this.SelectMyNbo(id, limit, idx);
      } else {
        result = await this.SelectNbo(id, keyword, limit, idx, search);
      }
      console.log('getSelectNboInfo');
      return result;
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  async ClickNbo(idx: number, id: string) {
    try {
      const result: NboEntity = await this.nboRepository
        .createQueryBuilder()
        .select(
          `idx,writetime,useridx,aka,likes,vilege,subject,title,content,isImg,commentes, imgupdate`,
        )
        .where({ idx: idx })
        .andWhere({pause:this.use})
        .getRawOne();

      if (result) {
        const commentReslt = await this.commentService.getComment(idx, id);
        const nbo_comment_imgIdxArr = await this.returnNboComment(
          result,
          commentReslt,
          id,
        );
        console.log('nbo_comment_imgIdxArr ', nbo_comment_imgIdxArr);
        return nbo_comment_imgIdxArr;
      } else {
        return { msg: 0 };
      }
    } catch (E) {
      console.log('ClickNbo', E);
      return { msg: E };
    }
  }

  async SelectNbo(
    id: string,
    keyword: string,
    limit: number,
    idx: number,
    search: string,
  ): Promise<NboEntity[]> {
    try {
      const idxWhere = idx ? { idx: LessThan(idx) } : '1=1';
      const keywordWhere = keyword ? `subject = '${keyword}'` : '1=1';
      if (search) {
        await this.InsertSearch(id, search);
      }
      const searchWhere = search ? `title LIKE '%${search}%'` : '1=1';
      const result: NboEntity[] = await this.nboRepository
        .createQueryBuilder()
        .select(this.select)
        .where(idxWhere)
        .andWhere(keywordWhere)
        .andWhere(searchWhere)
        .andWhere({pause:this.use})
        .orderBy('idx', 'DESC')
        .limit(limit)
        .getRawMany();
      return result;
    } catch (E) {
      console.log(E);
      return [];
    }
  }

  async InsertSearch(id: string, search: string): Promise<boolean> {
    try {
      const result = await this.nboSearchRepository
        .createQueryBuilder()
        .insert()
        .into(NboSearchEntity)
        .values([
          {
            id: id,
            search: search,
          },
        ])
        .execute();
      return result.identifiers.length > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async SelectMyNbo(
    id: string,
    limit: number,
    idx: number,
  ): Promise<NboEntity[]> {
    try {
      const idxWhere = idx > 0 ? { idx: LessThan(idx) } : '1=1';
      const result: NboEntity[] = await this.nboRepository
        .createQueryBuilder()
        .select(this.select)
        .where({ id: id })
        .andWhere(idxWhere)
        .andWhere({pause:this.use})
        .orderBy('idx', 'DESC')
        .limit(limit)
        .getRawMany();
      return result;
    } catch (E) {
      console.log(E);
      return [];
    }
  }

  async returnNboComment(
    nboInfo: any,
    commentArr: any[],
    userId: string,
  ): Promise<NboInterface> {
    const nboList = [];
    const commentIds = commentArr.map((c) => c.idx);
    const allSubComments = await this.commentService.getCommentsByParentIds(
      commentIds,
      userId,
    );
    for (const c of commentArr) {
      let cmtArr = [];
      if (c.commentes > 0) {
        cmtArr = allSubComments.filter((s) => s.commentNum === c.idx);
      }
      const model = {
        idx: c.idx,
        id: c.id,
        writetime: c.writetime,
        useridx: c.useridx,
        postNum: c.postNum,
        aka: c.aka,
        likes: c.likes,
        content: c.content,
        isImg: c.isImg,
        commentes: c.commentes,
        imgupDate: c.imgupdate,
        comments: cmtArr,
      };
      nboList.push(model);
    }

    const imgIdx_Arr = await this.nboImgService.imgIdxArr(nboInfo.idx);

    const nbo: NboInterface = {
      idx: nboInfo.idx,
      writetime: nboInfo.writetime,
      useridx: nboInfo.useridx,
      aka: nboInfo.aka,
      likes: nboInfo.likes,
      vilege: nboInfo.vilege,
      subject: nboInfo.subject,
      title: nboInfo.title,
      content: nboInfo.content,
      commentCount: nboInfo.commentes,
      imgupDate: nboInfo.imgupdate,
      imgIdxArr: imgIdx_Arr,
      commentDto: nboList,
    };
    return nbo;
  }

  getIs_imgExist(nboImg: number[][]) {
    return nboImg
      ? this.config.get<number>('IS_IMG_VALUE')
      : this.config.get<number>('IS_IMG_DEFAULT');
  }

  async InsertNbo(body: NboDTO): Promise<boolean | { msg: string | number }> {
    let allResult: boolean | { msg: number };
    try {
      const isImgExist = this.getIs_imgExist(body.nboImg);
      const values = {
        id: body.id,
        useridx: body.useridx,
        aka: body.aka,
        vilege: body.vilege,
        subject: body.subject,
        title: body.title,
        content: body.content,
        isImg: isImgExist,
        imgupdate:body.imgupDate
      };

      const result = await this.nboRepository
        .createQueryBuilder()
        .insert()
        .into(NboEntity)
        .values([values])
        .execute();

      if (result.identifiers.length > 0 && body.nboImg) {
        const idx = result.identifiers[0].idx;
        const imgResult = await this.nboImgService.InsertImg(
          body.nboImg,
          body.id,
          idx,
        );

        if (!imgResult) {
          await this.delete(idx);
          await this.nboImgService.delete(idx);
          allResult = { msg: 0 };
        } else {
          allResult = imgResult;
        }
      } else {
        allResult = result.identifiers.length > 0;
      }
      console.log('게시판 반환값 체크 ', allResult);
      return allResult;
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  async DeleteNbo(idx: number): Promise<boolean | { msg: string | number }> {
    try {
      const nboImgLogResult = await this.nboImgService.DeleteNboImg(idx);
      if (nboImgLogResult) {
        const commentResult = await this.DeleteCommentFromNbo(idx);
        if (commentResult) {
          const result = await this.delete(idx);
          return result;
        }
      }
      return { msg: 0 };
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  async delete(idx: number) {
    try {
      const result = await this.nboRepository
        .createQueryBuilder()
        .update(NboEntity)
        .set({ pause: this.pause })
        .where({ idx: idx })
        .execute();
      return result.affected > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async getNbo(idx: number): Promise<NboEntity> {
    try {
      const result: NboEntity = await this.nboRepository
        .createQueryBuilder()
        .select('*')
        .where({ idx: idx })
        .getRawOne();
      return result;
    } catch (E) {
      console.log(E);
    }
  }

  async InsertNboLog(body: NboEntity): Promise<boolean> {
    try {
      const result = await this.nboLogRepository
        .createQueryBuilder()
        .insert()
        .into(NboLogEntity)
        .values([
          {
            id: body.id,
            useridx: body.useridx,
            nboidx: body.idx,
            aka: body.aka,
            vilege: body.vilege,
            title: body.title,
            content: body.content,
            isImg: body.isImg,
          },
        ])
        .execute();
      return result.identifiers.length > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async UpdateNbo(body: NboDTO) {
    try {
      const LogInsertResult = await this.SelectToInsertNboLog(body.idx);

      if (LogInsertResult) {
        const isImgExist = this.getIs_imgExist(body.nboImgDto.nboImg);
        const set = {
          vilege: body.vilege,
          writetime: body.writetime,
          content: body.content,
          isImg: isImgExist,
        };

        const result = await this.nboRepository
          .createQueryBuilder()
          .update(NboEntity)
          .set(set)
          .where({ idx: body.idx })
          .execute();

        if (result.affected > 0 && body.nboImgDto) {
          const nboImgResult = await this.nboImgService.UpdateImg(
            body.nboImgDto,
            body.idx,
            body.isImg,
          );
          return nboImgResult;
        }
      }
      return { msg: 0 };
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  async updateCommentesPlusNbo(idx: number) {
    try {
      const result = await this.nboRepository
        .createQueryBuilder()
        .update(NboEntity)
        .set({ commentes: () => 'commentes + 1' })
        .where({ idx: idx })
        .execute();
      return result.affected > 0;
    } catch (E) {
      console.log('updateCommentesNbo ', E);
      return false;
    }
  }

  async updateCommentesMinusNbo(idx: number, commentes?: number) {
    try {
      const result = await this.nboRepository
        .createQueryBuilder()
        .update(NboEntity)
        .set({
          commentes: () => `commentes - ${commentes ? commentes + 1 : 1}`,
        })
        .where('commentes > 0 AND idx = :idx', { idx: idx })
        .execute();
      return true;
    } catch (E) {
      console.log('updateCommentesNbo ', E);
      return false;
    }
  }

  async SelectToInsertNboLog(idx: number): Promise<boolean> {
    try {
      const result = await this.getNbo(idx);
      const insertResult = await this.InsertNboLog(result);
      return insertResult;
    } catch (E) {
      console.log(E);
      return false;
    }
  }
}
