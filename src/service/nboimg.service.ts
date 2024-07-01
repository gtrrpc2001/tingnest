import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NboImgEntity, nboImgLogEntity } from 'src/entity/nboImg.entity';
import { NboImgDTO } from 'src/dto/nboimg.dto';
import { commonFun } from 'src/clsfunc/commonfunc';
import { Response } from 'express';
import * as dayjs from 'dayjs';

@Injectable()
export class NboImgService {
  constructor(
    @InjectRepository(NboImgEntity)
    private nboImgRepository: Repository<NboImgEntity>,
    @InjectRepository(nboImgLogEntity)
    private nboImgLogRepository: Repository<nboImgLogEntity>,
  ) {}

  async InsertImg(
    nboImg: number[][],
    id: string,
    idx: number,
  ): Promise<boolean> {
    let result = true;
    try {
      for (const value of nboImg) {
        const img = commonFun.getImageBuffer(value);

        const insert = await this.nboImgRepository
          .createQueryBuilder()
          .insert()
          .into(NboImgEntity)
          .values([
            {
              id: id,
              nboidx: idx,
              nboImg: img,
            },
          ])
          .execute();

        if (insert.identifiers.length < 1) {
          throw new Error('Insert failed');
        }
      }
      return result;
    } catch (E) {
      console.log('InsertImg : ' + E);
      return false;
    }
  }

  async UpdateImg(
    body: NboImgDTO,
    nboidx: number,
    isImg: number,
  ) {
    try {
      let isSuccess;      
      if (isImg) {
        for (const idx of body.idx) {          
          isSuccess = await this.updateImages(idx,nboidx,null)
          if(!isSuccess){
            break;
          }
        }        
      } else {
        const idxArr:number[] = []
        for (const [index, value] of body.nboImg.entries()) {          
          isSuccess = await this.updateImages(body.idx[index],nboidx,value)
          if(!isSuccess){
            break;
          }
          idxArr.push(isSuccess)
        }
        return idxArr;
      }
      console.log('UpdateImg');
      return isSuccess;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async updateImages(idx: number, nboidx: number,value?:number[]) {
    const imageLogData = await this.getImage(idx);
    const imageLogInsertResult = await this.InsertImgLog(imageLogData, nboidx);
    if (imageLogInsertResult) {
      const deleteResult = await this.deleteOne(idx);
      if(value && deleteResult){
        const img = commonFun.getImageBuffer(value)
        const result = await this.nboImgRepository
          .createQueryBuilder()
          .insert()
          .into(NboImgEntity)
          .values([{
            id: imageLogData.id,
            nboidx: nboidx,
            nboImg: img,
          }])
          .execute();
          if(result.identifiers.length > 0){
            return Number(result.identifiers[0].idx)
          }
      }else if(deleteResult){
        return deleteResult;
      }
    }
    return false;
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

  async selectFirstImg(nboidx: number): Promise<Buffer> {
    try {
      const result: NboImgEntity = await this.nboImgRepository
        .createQueryBuilder()
        .select('idx,nboImg')
        .where({ nboidx: nboidx })
        .orderBy('idx', 'ASC')
        .getRawOne();

      console.log('selectFirstImg');
      if (result) {
        return result.nboImg;
      } else {
        return null;
      }
    } catch (E) {
      console.log('selectFirstImg : ' + E);
      return null;
    }
  }

  async sendFirstImg(res: Response, nboidx: number) {
    try {
      const result: NboImgEntity = await this.nboImgRepository
        .createQueryBuilder()
        .select('idx,nboImg')
        .where({ nboidx: nboidx })
        .orderBy('idx', 'ASC')
        .getRawOne();
      if (result.nboImg) {
        commonFun.ResponseImage(res, result.nboImg);
      }
    } catch (E) {
      res.send({ msg: E });
    }
  }

  async sendImg(res: Response, idx: number) {
    try {
      const result: NboImgEntity = await this.nboImgRepository
        .createQueryBuilder()
        .select('nboImg')
        .where({ idx: idx })
        .getRawOne();
      if (result.nboImg) {
        commonFun.ResponseImage(res, result.nboImg);
      }
    } catch (E) {
      res.send({ msg: E });
    }
  }

  async imgIdxArr(nboidx: number): Promise<number[]> {
    try {
      const result: NboImgEntity[] = await this.nboImgRepository
        .createQueryBuilder()
        .select('idx')
        .where({ nboidx: nboidx })
        .orderBy('idx', 'ASC')
        .getRawMany();
      const idxArr = result.length != 0 ? result.map((i) => i.idx) : [];
      return idxArr;
    } catch (E) {
      console.log(E);
      return [];
    }
  }

  async DeleteNboImg(nboidx: number): Promise<boolean> {
    try {
      const nboImges = await this.selectImg(nboidx);
      if(nboImges.length > 0) {
        const results = [];
        for (const i of nboImges) {
          const result = await this.InsertImgLog(i, nboidx);
          results.push(result);
        }
        if (results.every((result) => result === true)) {
          const result = await this.delete(nboidx);
          return result;
        } else {
          return false;
        }
      }else{
        return true;
      }
    } catch (E) {
      console.log('DeleteNboImg : ' + E);
      return false;
    }
  }

  async delete(nboidx: number): Promise<boolean> {
    try {
      const result = await this.nboImgRepository
        .createQueryBuilder()
        .delete()
        .where({ nboidx: nboidx })
        .execute();
      return result.affected > 0;
    } catch (E) {
      console.log('delete : ' + E);
      return false;
    }
  }

  async deleteOne(idx: number): Promise<boolean> {
    try {
      const result = await this.nboImgRepository
        .createQueryBuilder()
        .delete()
        .where({ idx: idx })
        .execute();
      return result.affected > 0;
    } catch (E) {
      console.log('delete : ' + E);
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
