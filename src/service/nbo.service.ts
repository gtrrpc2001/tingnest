import { NboEntity, NboLogEntity } from 'src/entity/nbo.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, MoreThan, In } from 'typeorm';
import { commonFun } from 'src/clsfunc/commonfunc';
import { NboImgService } from './nboimg.service';
import { CommentService } from './comment.service';
import { NboDTO } from 'src/dto/nbo.dto';

@Injectable()
export class NboService {
  constructor(
    @InjectRepository(NboEntity) private nboRepository: Repository<NboEntity>,
    @InjectRepository(NboLogEntity)
    private nboLogRepository: Repository<NboLogEntity>,
    private nboImgService: NboImgService,
    private commentService: CommentService,
  ) {}

  async gubunKind(body: NboDTO): Promise<any> {
    switch (body.kind) {
      case 'nboInsert':
        return await this.InsertNbo(body);
      case 'nboDelete':
        return await this.DeleteNbo(body);
      case 'nboUpdate':
        return await this.UpdateNbo(body);
      case null:
        return false;
    }
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
          content: body.content,
          Img: image,
        };
      } else {
        values = {
          id: body.id,
          aka: body.aka,
          vilege: body.vilege,
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

  async DeleteNbo(body: NboDTO): Promise<boolean | { msg: string | number }> {
    try {
      const LogInsertResult = await this.SelectToInsertNboLog(body.idx);

      if (LogInsertResult) {
        const nboImgLogResult = await this.nboImgService.DeleteNboImg(body.idx);
        const commentLogResult = await this.commentService.CommentLogInsert(
          body.idx,
        );

        if (nboImgLogResult && commentLogResult) {
          const result = await this.nboRepository
            .createQueryBuilder()
            .delete()
            .where({ idx: body.idx })
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
