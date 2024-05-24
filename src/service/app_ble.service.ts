import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAccessStrategy } from 'src/jwt/jwtAccessStrategy';
import { app_bleEntity } from 'src/entity/app_ble.entity';

@Injectable()
export class app_bleService {
  constructor(
    @InjectRepository(app_bleEntity)
    private app_bleRepository: Repository<app_bleEntity>,
  ) {}

  async LogInsert(body: any): Promise<any> {
    var boolResult = false;
    try {
      const result = await this.app_bleRepository
        .createQueryBuilder()
        .insert()
        .into(app_bleEntity)
        .values([
          {
            eq: body.eq,
            phone: body.phone,
            writetime: body.writetime,
            activity: body.activity,
            serial: body.serial,
          },
        ])
        .execute();
      console.log(result);
      boolResult = true;
      var jsonValue = 'result = ' + boolResult.toString();
      console.log('app_log - insert');
      return jsonValue;
    } catch (E) {
      console.log(E);
      return E;
    }
  }
}
