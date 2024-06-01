import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAccessStrategy } from 'src/jwt/jwtAccessStrategy';
import { Class_userEntity } from 'src/entity/class_user.entity';

@Injectable()
export class Class_userService {
  constructor(
    @InjectRepository(Class_userEntity)
    private class_userRepository: Repository<Class_userEntity>,
  ) {}

  async Insert_ClassUser(body: any): Promise<any> {    
    try {
      // const result = await this.app_bleRepository
      //   .createQueryBuilder()
      //   .insert()
      //   .into(app_bleEntity)
      //   .values([
      //     {
      //       eq: body.eq,
      //       phone: body.phone,
      //       writetime: body.writetime,
      //       activity: body.activity,
      //       serial: body.serial,
      //     },
      //   ])
      //   .execute();
      // console.log(result);
      // boolResult = true;
      // var jsonValue = 'result = ' + boolResult.toString();
      // console.log('app_log - insert');
      return ;
    } catch (E) {
      console.log(E);
      return E;
    }
  }
}
