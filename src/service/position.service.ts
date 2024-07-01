import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PositionEntity,
  UserPositionEntity,
} from 'src/entity/user_position.entity';
import { PositionDTO } from 'src/dto/position.dto';
import { UserEntity } from 'src/entity/user.entity';
import { Position } from 'src/interface/Position';
import { commonFun } from 'src/clsfunc/commonfunc';

@Injectable()
export class PositionService {
  constructor(
    @InjectRepository(PositionEntity)
    private positionRepository: Repository<PositionEntity>,
    @InjectRepository(UserPositionEntity)
    private userPositionRepository: Repository<UserPositionEntity>,
  ) {}

  async InsertPosition(body: PositionDTO): Promise<any> {
    try {
      let boolResult = false;
      const result = await this.positionRepository
        .createQueryBuilder()
        .insert()
        .into(PositionEntity)
        .values([
          { id: body.id, latitude: body.latitude, longitude: body.longitude },
        ])
        .execute();
      await this.UserPositionUpdate(body);
      if (body.address != null) {
        await this.UserPositionUpdateAddress(body.id, body.address);
      }
      console.log(`position insert`);
      boolResult = true;
      return boolResult ? boolResult?.toString() : { msg: 0 };
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  async InsertUserPosition(body: PositionDTO): Promise<boolean> {
    try {
      let boolResult = false;
      const result = await this.userPositionRepository
        .createQueryBuilder()
        .insert()
        .into(UserPositionEntity)
        .values([
          {
            useridx: body.useridx,
            id: body.id,
            imgupdate:body.imgupdate,
            aka: body.aka,
          },
        ])
        .execute();
      console.log(`position insert`);
      boolResult = true;
      return boolResult;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async UserPositionUpdate(body: PositionDTO): Promise<boolean> {
    try {
      const renewtime = commonFun.getDayjs()
      const result = await this.userPositionRepository
        .createQueryBuilder()
        .update(UserPositionEntity)
        .set({
          writetime: renewtime,
          latitude: body.latitude,
          longitude: body.longitude,
        })
        .where({ id: body.id })
        .execute();
      return true;
    } catch (E) {
      console.log(E);
      return false;
    }
  }  

  async UserPositionUpdateAddress(
    id: string,
    address: string,
  ): Promise<boolean> {
    try {
      const result = await this.userPositionRepository
        .createQueryBuilder()
        .update(UserPositionEntity)
        .set({ address: address })
        .where({ id: id })
        .execute();
      return true;
    } catch (E) {
      console.log(E);
      return false;
    }
  }  

  async getUserPositionVisible(id: string): Promise<number> {
    try {
      const result: UserPositionEntity = await this.userPositionRepository
        .createQueryBuilder()
        .select('visible')
        .where({ id: id })
        .getRawOne();
      return result.visible;
    } catch (E) {
      console.log(E);
      return 0;
    }
  }

  async updateVisible(body:PositionDTO) {
    try {      
      const result = await this.userPositionRepository
        .createQueryBuilder()
        .update(UserPositionEntity)
        .set({ visible: body.visible })
        .where({ id: body.id })
        .execute();
      console.log('updateVisible : ', result.affected > 0);
      return result.affected > 0;
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  async GetUserPosition(id: string) {
    try {
      const result = await this.userPositionRepository
        .createQueryBuilder()
        .select('useridx,aka,latitude,longitude,visible,imgupdate')
        .where(`id != '${id}'`)
        .getRawMany();
      return result;
    } catch (E) {
      console.log(E);
      return [];
    }
  }
}
