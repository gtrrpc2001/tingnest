import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NboImgEntity, nboImgLogEntity } from 'src/entity/nboImg.entity';
import { NboImgDTO } from 'src/dto/nboimg.dto';
import { commonFun } from 'src/clsfunc/commonfunc';
import { NboDTO } from 'src/dto/nbo.dto';

@Injectable()
export class NboImgService {
  constructor(
    @InjectRepository(NboImgEntity)
    private nboImgRepository: Repository<NboImgEntity>,
    @InjectRepository(nboImgLogEntity)
    private nboImgLogRepository: Repository<nboImgLogEntity>,
  ) {}

  async InsertImg(body: NboImgDTO, idx: number): Promise<boolean> {
    const queryRunner = await this.getQueryRunner();
    try {
      for (const value of body.nboImg) {
        const img = commonFun.getImageBuffer(value);
        await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into(NboImgEntity)
          .values([
            {
              id: body.id,
              nboidx: idx,
              nboImg: img,
            },
          ])
          .execute();
      }
      await queryRunner.commitTransaction();
      console.log('InsertImg');
      return true;
    } catch (E) {
      await queryRunner.rollbackTransaction();
      console.log('InsertImg : ' + E);
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  async UpdateImg(body: NboImgDTO): Promise<boolean> {
    const queryRunner = await this.getQueryRunner();
    try {
      let isSuccess = true;
      for (const [index, value] of body.nboImg.entries()) {
        const imageLogData = await this.getImage(body.idx[index]);
        const imageLogInsertResult = await this.InsertImgLog(
          imageLogData,
          body.nboidx,
        );

        if (imageLogInsertResult) {
          const img = commonFun.getImageBuffer(value);
          const result = await queryRunner.manager
            .createQueryBuilder()
            .update(NboImgEntity)
            .set({ nboImg: img, writetime: body.writetime })
            .where({ idx: body.idx[index] })
            .execute();

          if (result.affected === 0) {
            isSuccess = false;
            break;
          }
        } else {
          isSuccess = false;
          break;
        }
      }

      if (isSuccess) {
        await queryRunner.commitTransaction();
      } else {
        await queryRunner.rollbackTransaction();
      }

      console.log('UpdateImg');
      return isSuccess;
    } catch (E) {
      console.log(E);
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  async getQueryRunner() {
    const queryRunner =
      this.nboImgRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  }

  async getImages(nboidx: number): Promise<NboImgEntity[]> {
    try {
      const result: NboImgEntity[] = await this.nboImgRepository
        .createQueryBuilder()
        .select('idx,nboImg')
        .where({ nboidx: nboidx })
        .getRawMany();
      console.log('getImages');
      return result;
    } catch (E) {
      console.log('getImages : ' + E);
    }
  }

  async getImage(idx: number): Promise<NboImgEntity> {
    try {
      const result: NboImgEntity = await this.nboImgRepository
        .createQueryBuilder()
        .select('*')
        .where({ idx: idx })
        .getRawOne();
      console.log('getImage');
      return result;
    } catch (E) {
      console.log('getImage : ' + E);
    }
  }

  async selectImg(nboidx: number): Promise<NboImgEntity[]> {
    try {
      const result: NboImgEntity[] = await this.nboImgRepository
        .createQueryBuilder()
        .select('*')
        .where({ nboidx: nboidx })
        .getRawMany();
      console.log('selectImg');
      return result;
    } catch (E) {
      console.log('selectImg : ' + E);
    }
  }

  async DeleteNboImg(nboidx: number): Promise<boolean> {
    try {
      const nboImges = await this.selectImg(nboidx);
      const results = [];
      for (const i of nboImges) {
        const result = await this.InsertImgLog(i, nboidx);
        results.push(result);
      }
      return results.every((result) => result === true);
    } catch (E) {
      console.log('DeleteNboImg : ' + E);
      return false;
    }
  }

  async InsertImgLog(body: NboImgEntity, idx: number): Promise<boolean> {
    try {
      const result = await this.nboImgLogRepository
        .createQueryBuilder()
        .insert()
        .into(nboImgLogEntity)
        .values([
          {
            id: body.id,
            nboidx: idx,
            nboImg: body.nboImg,
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
}
