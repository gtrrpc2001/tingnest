import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDTO } from '../dto/user.dto';
import { commonFun } from 'src/clsfunc/commonfunc';
import { DelUserLogEntity, UserEntity } from 'src/entity/user.entity';
import { isDefined } from 'class-validator';
import { pwBcrypt } from 'src/clsfunc/pwAES';
import { Login_logService } from './login_log.service';
import { Login_logDTO } from 'src/dto/Login_log.dto';
import { ConfigService } from '@nestjs/config';
import { commonQuery } from 'src/clsfunc/commonQuery';
import { Response } from 'express';
import { Readable } from 'stream';
import { PositionDTO } from 'src/dto/position.dto';
import { PositionService } from './position.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(DelUserLogEntity)
    private DeleteUserLogRepository: Repository<DelUserLogEntity>,
    private positionService: PositionService,
    private login_logService: Login_logService,
    private config: ConfigService,
  ) {}

  activate = this.config.get<string>('USER_ACTIVITY_LOGIN');

  async gubunKind(body: UserDTO): Promise<any> {
    switch (body.kind) {
      case 'idDupe':
        return await this.checkIDDupe(body.id);
      case 'login':
        return await this.Login(body);
      case 'logout':
        //to do
        const guard = this.config.get<number>('USER_GUARD_LOGOUT');
        const logBody: Login_logDTO = {
          id: body.id,
          writetime: body.writetime,
          activity: body.activate,
        };
        await this.login_logService.LogInsert(logBody);
        return await commonQuery
          .UpdateGuard(this.userRepository, body.id, body.activate, guard)
          ?.toString();
      case 'signUp':
        return await this.signUp(body);
      case 'profileUpdate':
        return await this.profileUpdate(body);
      case 'updatePWD':
        return await this.updatePWD(body);
      case 'deleteUser':
        //to do
        return await this.userDelete(body);
      case 'findID':
        return await this.getFindID(body);
      case 'updateToken':
        return await this.updateToken(body);
      case 'profile':
        return await this.getProfile(body.id);
      case null:
        return false?.toString();
    }
  }

  async findByFields(id: string, phone: string): Promise<UserEntity> {
    try {
      const result: UserEntity = await this.userRepository
        .createQueryBuilder()
        .select('*')
        .where({ id: id })
        .andWhere({ phone: phone })
        .getRawOne();
      return result;
    } catch (E) {
      console.log(E);
    }
  }

  async userDelete(body: UserDTO): Promise<string> {
    try {
      var info = await this.getUserDelete_Info(body.id);
      if (!info) {
        let bool = await this.setInsert(
          this.DeleteUserLogRepository,
          DelUserLogEntity,
          body,
        );
        if (bool) {
          return await this.setDelete(body.id);
        } else {
          return false?.toString();
        }
      }
    } catch (E) {
      console.log(E);
      return false?.toString();
    }
  }

  async setDelete(id: string): Promise<any> {
    try {
      const result = await this.userRepository
        .createQueryBuilder()
        .delete()
        .where({ id: id })
        .execute();
      return result.affected > 0;
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  async getUserDelete_Info(id: string): Promise<any> {
    try {
      const result: UserEntity = await this.userRepository
        .createQueryBuilder()
        .select('*')
        .where({ id: id })
        .getRawOne();
      return result;
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  async profileUpdate(body: UserDTO): Promise<any> {
    try {
      var boolResult = false;
      const profile = commonFun.getImageBuffer(body.profile);
      console.log(body.imgupdate);
      const result = await this.userRepository
        .createQueryBuilder()
        .update(UserEntity)
        .set({
          imgupdate: body.imgupdate,
          profile: profile,
        })
        .where({ id: body.id })
        .execute();
      await this.positionService.UserPositionUpdateRenewDate(
        body.id,
        body.imgupdate,
      );
      boolResult = true;
      console.log('setProfile');
      return boolResult?.toString();
    } catch (E) {
      console.log('profileUpdate' + E);
      return { msg: E };
    }
  }

  async getFindID(body: UserDTO): Promise<any> {
    try {
      const result: UserEntity = await this.userRepository
        .createQueryBuilder()
        .select('id,signupdate')
        .where({ phone: body.phone })
        .getRawOne();
      console.log('getFindID');
      return { id: result.id, signupdate: result.signupdate };
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  async getID(id: string): Promise<string> {
    try {
      const result: UserEntity = await this.userRepository
        .createQueryBuilder()
        .select('id')
        .where({ id: id })
        .getRawOne();
      return result.id;
    } catch (E) {
      console.log(E);
    }
  }

  async signUp(body: UserDTO): Promise<any> {
    try {
      const result = await this.setInsert(
        this.userRepository,
        UserEntity,
        body,
        true,
      );
      const positionBody: PositionDTO = {
        useridx: result,
        id: body.id,
        imgupdate: body.imgupdate,
        latitude: 0,
        longitude: 0,
        address: null,
        aka: body.aka,
      };
      console.log(positionBody);
      await this.positionService.InsertUserPosition(positionBody);
      return result?.toString();
    } catch (E) {
      console.log('signUp' + E);
      return { msg: E };
    }
  }

  async setInsert(
    repository: Repository<any>,
    entity: any,
    body: UserDTO,
    primary: boolean = false,
  ): Promise<any> {
    try {
      const AESpwd = await pwBcrypt.transformPassword(body.pwd);
      const profile = commonFun.getImageBuffer(body.profile);
      const result = await repository
        .createQueryBuilder()
        .insert()
        .into(entity)
        .values([
          {
            id: body.id,
            phone: body.phone,
            pwd: AESpwd,
            birth: body.birth,
            gender: body.gender,
            signupdate: body.signupdate,
            pause: body.pause,
            profile: profile,
            aka: body.aka,
            guard: 0,
            activate: body.activate,
            access_token: body.access_token,
            refresh_token: body.refresh_token,
            alarm_token: body.alarm_token,
          },
        ])
        .execute();

      console.log('setInsert user');
      console.log(result.identifiers);
      return primary ? result.identifiers[0].idx : true;
    } catch (E) {
      console.log('setInsert : ' + E);
      return false;
    }
  }

  async sendProfiles(res: Response, id: string): Promise<any> {
    try {
      const result: UserEntity[] = await this.userRepository
        .createQueryBuilder('user')
        .select('profile')
        .where({ id: id })
        // .where("user.id != :id",{"id":id})
        // .where({"activate":this.activate})
        .getRawMany();
      console.log(result);
      if (result.length != 0) {
        result.map((d) => {
          this.ResponseProfile(res, d.profile);
        });
      } else res.send({ msg: 0 });
    } catch (E) {
      res.send({ msg: E });
    }
  }

  async sendProfile(res: Response, idx: number): Promise<any> {
    try {
      const result: UserEntity = await this.userRepository
        .createQueryBuilder()
        .select('profile')
        .where({ id: 'test' })
        // .where({"idx":idx})
        .getRawOne();
      // .andWhere({"activate":this.activate})
      if (result) {
        this.ResponseProfile(res, result.profile);
      } else res.send({ msg: 0 });
    } catch (E) {
      res.send({ msg: E });
    }
  }

  ResponseProfile = (res: Response, profile: Buffer) => {
    const readableStream = new Readable({
      read() {
        this.push(profile);
        this.push(null);
      },
    });
    readableStream.pipe(res);
  };

  async getProfile(id: string): Promise<any> {
    try {
      const result: UserEntity = await this.userRepository
        .createQueryBuilder()
        .select('idx,id,phone,birth,gender,profile,aka')
        .where({ id: id })
        .getRawOne();
      const profile = commonFun.getImageBase64(result.profile);
      const length = result.profile?.length;
      const user = {
        idx: result.idx,
        id: id,
        phone: result.phone,
        birth: result.birth,
        gender: result.gender,
        profile: length == 0 ? null : profile,
        aka: result.aka,
      };
      return commonFun.converterJson(user);
    } catch (E) {
      console.log('getProfile' + E);
      return false?.toString();
    }
  }

  async CheckLogin(body: UserDTO): Promise<boolean> {
    try {
      const result: UserEntity = await this.userRepository
        .createQueryBuilder('')
        .select('pwd')
        .where({ id: body.id })
        .getRawOne();
      var bool = await pwBcrypt.validatePwd(body.pwd, result.pwd);
      console.log('CheckLogin');
      return bool;
    } catch (E) {
      console.log('CheckLogin : ' + E);
    }
  }

  async Login(body: UserDTO): Promise<any> {
    try {
      var bool = false;
      var profile = null;
      const guard = this.config.get<number>('USER_GUARD_LOGIN');

      if (body.guard == 0) {
        var checkLogin = await this.CheckLogin(body);
        if (checkLogin) {
          bool = await commonQuery.UpdateGuard(
            this.userRepository,
            body.id,
            this.activate,
            guard,
          );
        }
      } else if (body.guard == 1) {
        bool = await this.Login_sec(body, guard);
      }

      if (bool) {
        var logModel: Login_logDTO = {
          id: body.id,
          writetime: body.writetime,
          activity: this.activate,
        };
        await this.login_logService.LogInsert(logModel);
        profile = await this.getProfile(body.id);
      }

      return bool ? { profile: profile } : { msg: 0 };
    } catch (E) {
      console.log('Login : ' + E);
      return { msg: E };
    }
  }

  async Login_sec(body: UserDTO, guard: number): Promise<boolean> {
    try {
      const result = await this.userRepository
        .createQueryBuilder()
        .select('id')
        .where({ id: body.id })
        .andWhere({ guard: guard })
        .getRawOne();
      if (result) {
        return true;
      } else {
        return false;
      }
    } catch (E) {
      return false;
    }
  }

  async checkIDDupe(id: string): Promise<any> {
    try {
      var boolResult = false;
      if (isDefined(id)) {
        const result: UserEntity[] = await this.userRepository
          .createQueryBuilder('user')
          .select('id')
          .where({ id: id })
          .getRawMany();
        if (result.length == 0) {
          const rs = await this.DeleteUserLogRepository.createQueryBuilder()
            .select('id')
            .where({ id: id })
            .getRawMany();
          if (rs.length == 0) boolResult = true;
        }
      }
      console.log('checkIDDupe');
      return boolResult ? boolResult : { msg: 0 };
    } catch (E) {
      console.log('checkIDDupe : ' + E);
      return { msg: E };
    }
  }

  async updatePWD(body: UserDTO): Promise<string> {
    try {
      var boolResult = false;
      const AESpwd = await pwBcrypt.transformPassword(body.pwd);
      const result = await this.userRepository
        .createQueryBuilder()
        .update(UserEntity)
        .set({ pwd: AESpwd })
        .where({ id: body.id })
        .execute();
      boolResult = true;
      console.log('updatePWD');
      return boolResult?.toString();
    } catch (E) {
      console.log('updatePWD : ' + E);
      return false?.toString();
    }
  }

  async updateToken(body: UserDTO): Promise<string> {
    try {
      var boolResult = false;
      const result = await this.userRepository
        .createQueryBuilder()
        .update(UserEntity)
        .set({ alarm_token: body.alarm_token })
        .where({ id: body.id })
        .execute();
      boolResult = true;
      console.log('updateToken');
      return boolResult?.toString();
    } catch (E) {
      console.log('updateToken : ' + E);
      return false?.toString();
    }
  }

  async checkUserPhone(phone: string): Promise<boolean> {
    try {
      var boolResult = false;
      const result = await this.userRepository
        .createQueryBuilder()
        .select('phone')
        .where({ phone: phone })
        .getRawMany();
      if (result.length == 0) boolResult = true;
      console.log('phone check');
      return boolResult;
    } catch (E) {
      console.log('updatePWD : ' + E);
      return false;
    }
  }
}
