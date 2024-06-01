import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PositionEntity,
  UserPositionEntity,
} from 'src/entity/user_position.entity';
import { PositionDTO } from 'src/dto/position.dto';

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
            imgupdate: body.imgupdate,
            latitude: body.latitude,
            longitude: body.longitude,
            address: body.address,
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
      const result = await this.userPositionRepository
        .createQueryBuilder()
        .update(UserPositionEntity)
        .set({
          writetime: body.writetime,
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

  async UserPositionUpdateRenewDate(
    id: string,
    renewtime: string,
  ): Promise<boolean> {
    try {
      const result = await this.userPositionRepository
        .createQueryBuilder()
        .update(UserPositionEntity)
        .set({ renewtime: renewtime })
        .where({ id: id })
        .execute();
      return true;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async GetUserPosition(id: string): Promise<any> {
    try {
      const result: UserPositionEntity[] = await this.userPositionRepository
        .createQueryBuilder('position')
        .select('useridx,aka,latitude,longitude,visible')
        .where('position.id != :id', { id: id })
        .getRawMany();
      console.log(result?.length);
      return result;
    } catch (E) {
      console.log(E);
      return false;
    }
  }
}
