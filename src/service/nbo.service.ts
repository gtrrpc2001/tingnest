import { NboEntity, NboLogEntity } from 'src/entity/nbo.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, MoreThan, LessThan, In } from 'typeorm';
import { commonFun } from 'src/clsfunc/commonfunc';
import { NboImgService } from './nboimg.service';
import { CommentService } from './comment.service';
import { NboDTO } from 'src/dto/nbo.dto';
import { NboInterface } from 'src/interface/nbo';

@Injectable()
export class NboService {
  constructor(
    @InjectRepository(NboEntity) private nboRepository: Repository<NboEntity>,
    @InjectRepository(NboLogEntity)
    private nboLogRepository: Repository<NboLogEntity>,
    private nboImgService: NboImgService,
    private commentService: CommentService,
  ) {}
  private select = 'idx,writetime,aka,likes,vilege,subject,title,content';
  async gubunKind(body: NboDTO): Promise<any> {
    switch (body.kind) {
      case 'nboInsert':
        return await this.InsertNbo(body);
      case 'nboDelete':
        return await this.DeleteNbo(body.idx);
      case 'nboUpdate':
        return await this.UpdateNbo(body);
      case null:
        return false;
    }
  }

  async getQueryRunner() {
    const queryRunner =
      this.nboRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  }

  async getSelectNboInfo(
    id: string,
    keyword: string,
    limit: number,
    idx: number,
    search: string,
  ) {
    try {
      let result;
      console.log(keyword);
      if (id) {
        result = await this.SelectMyNbo(id, limit, idx);
      } else {
        result = await this.SelectNbo(keyword, limit, idx, search);
      }
      return result;
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  async SelectNbo(
    keyword: string,
    limit: number,
    idx: number,
    search: string,
  ): Promise<NboEntity[]> { //modelNbo[]
    try {
      const idxWhere = idx ? { idx: LessThan(idx) } : '1=1';
      const keywordWhere = keyword ? `subject LIKE '%${keyword}%'` : '1=1';
      const searchWhere = search ? `title LIKE '%${search}%'` : '1=1';
      const result: NboEntity[] = await this.nboRepository
        .createQueryBuilder()
        .select(this.select) //img
        .where(idxWhere)
        .andWhere(keywordWhere)
        .andWhere(searchWhere)
        .orderBy('writetime', 'DESC')
        .limit(limit)
        .getRawMany();

      return result;

      // const convertToResult = this.returnNboImage(result)
      // return convertToResult;
    } catch (E) {
      console.log(E);
      return [];
    }
  }

  async SelectMyNbo(
    id: string,
    limit: number,
    idx: number,
  ): Promise<NboInterface[]> {
    try {
      const idxWhere = idx > 0 ? { idx: LessThan(idx) } : '1=1';
      const result: NboEntity[] = await this.nboRepository
        .createQueryBuilder()
        .select(this.select)
        .where({ id: id })
        .andWhere(idxWhere)
        .orderBy('writetime', 'DESC')
        .limit(limit)
        .getRawMany();

      const convertToResult = this.returnNboImage(result)
      return convertToResult;
    } catch (E) {
      console.log(E);
      return [];
    }
  }

  returnNboImage(result: NboEntity[]) {
    const nboList: NboInterface[] = [];
    for (const n of result) {
      const img = commonFun.getImageBase64(n.Img);
      const nbo: NboInterface = {
        idx: n.idx,
        writetime: n.writetime,
        aka: n.aka,
        likes: n.likes,
        vilege: n.vilege,
        subject: n.subject,
        title: n.title,
        content: n.content,
        img: img,
      };
      nboList.push(nbo);
    }
    return nboList;
  }

  async InsertNbo(body: NboDTO): Promise<boolean | { msg: string | number }> {
    try {
      const nboImag = body.nboImgDto.nboImg;
      let values = {};
      if (nboImag) {
        const image = commonFun.getImageBuffer(nboImag[0]);
        values = {
          id: body.id,
          aka: body.aka,
          vilege: body.vilege,
          subject: body.subject,
          title: body.title,
          content: body.content,
          Img: image,
        };
      } else {
        values = {
          id: body.id,
          aka: body.aka,
          vilege: body.vilege,
          subject: body.subject,
          title: body.title,
          content: body.content,
        };
      }

      const result = await this.nboRepository
        .createQueryBuilder()
        .insert()
        .into(NboEntity)
        .values([values])
        .execute();

      if (result.identifiers.length > 0) {
        const idx = result.identifiers[0].idx;
        const imgResult = await this.nboImgService.InsertImg(
          body.nboImgDto,
          idx,
        );
        return imgResult;
      } else {
        return { msg: 0 };
      }
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  async DeleteNbo(idx: number): Promise<boolean | { msg: string | number }> {
    try {
      const LogInsertResult = await this.SelectToInsertNboLog(idx);

      if (LogInsertResult) {
        const nboImgLogResult = await this.nboImgService.DeleteNboImg(idx);
        const commentLogResult = await this.commentService.CommentLogInsert(
          idx,
        );

        if (nboImgLogResult && commentLogResult) {
          const result = await this.nboRepository
            .createQueryBuilder()
            .delete()
            .where({ idx: idx })
            .execute();
          return result.affected > 0;
        }
      }

      return { msg: 0 };
    } catch (E) {
      console.log(E);
      return { msg: E };
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
            aka: body.aka,
            vilege: body.vilege,
            title: body.title,
            content: body.content,
            Img: body.Img,
          },
        ])
        .execute();
      return result.identifiers.length > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async UpdateNbo(body: NboDTO): Promise<any> {
    try {
      const LogInsertResult = await this.SelectToInsertNboLog(body.idx);

      if (LogInsertResult) {
        const nboImag = body.nboImgDto.nboImg;
        let set = {};

        if (nboImag) {
          const image = commonFun.getImageBuffer(nboImag[0]);
          set = {
            vilege: body.vilege,
            writetime: body.writetime,
            content: body.content,
            Img: image,
          };
        } else {
          set = {
            vilege: body.vilege,
            writetime: body.writetime,
            content: body.content,
          };
        }

        const result = await this.nboRepository
          .createQueryBuilder()
          .update(NboEntity)
          .set(set)
          .where({ idx: body.idx })
          .execute();

        if (result.affected > 0) {
          const nboImgResult = await this.nboImgService.UpdateImg(
            body.nboImgDto,
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
