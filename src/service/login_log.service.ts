import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Login_logEntity } from 'src/entity/login_log.entity';
import { Login_logDTO } from 'src/dto/Login_log.dto';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/entity/user.entity';
import { commonQuery } from 'src/clsfunc/commonQuery';

@Injectable()
export class Login_logService {
  constructor(
    @InjectRepository(Login_logEntity)
    private login_logRepository: Repository<Login_logEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private config: ConfigService,
  ) {}
  async LogInsert(body: Login_logDTO,login:boolean): Promise<any> {
    var boolResult = false;
    try {
      const result = await this.login_logRepository
        .createQueryBuilder()
        .insert()
        .into(Login_logEntity)
        .values([
          {
            id: body.id,
            activity: body.activity,
          },
        ])
        .execute();
      const guard = login ? Number(this.config.get<number>('USER_GUARD_LOGIN')) : Number(this.config.get<number>('USER_GUARD_LOGOUT'))
      await commonQuery.UpdateGuard(
        this.userRepository,
        body.id,
        body.activity,
        guard,
      );
      boolResult = true;
      console.log('app_log - insert');
      return boolResult?.toString();
    } catch (E) {
      console.log(E);
      return E;
    }
  }
}
