import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDTO } from '../dto/user.dto';
import { commonFun } from 'src/clsfunc/commonfunc';
import { UserEntity } from 'src/entity/user.entity';
import { isDefined } from 'class-validator';
import { pwBcrypt } from 'src/clsfunc/pwAES';
import { Login_logService } from './login_log.service';
import { Login_logDTO } from 'src/dto/Login_log.dto';
import { ConfigService } from '@nestjs/config';
import { commonQuery } from 'src/clsfunc/commonQuery';
import { Response } from 'express';
import { PositionDTO } from 'src/dto/position.dto';
import { PositionService } from './position.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { NboService } from './nbo.service';
import { UserPositionEntity } from 'src/entity/user_position.entity';
import { UserPositionEventGateway } from './UserPositionEventGateway.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private positionService: PositionService,
    private login_logService: Login_logService,
    private config: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private nboService: NboService,
    private positionSocket: UserPositionEventGateway,
  ) {}
  pause = Number(this.config.get<number>('PAUSE'));
  use = Number(this.config.get<number>('USE'));
  path = this.config.get<string>('DEFAULT_PROFILE_IMAGE_PATH');
  activate = this.config.get<string>('USER_ACTIVITY_LOGIN');

  async gubunKind(body: UserDTO): Promise<any> {
    switch (body.kind) {
      case 'idDupe':
        return await this.checkIDDupe(body.id);
      case 'login':
        return await this.Login(body);
      case 'login_log':
        return this.LoginLog_scheduleCancel(body);
      case 'logout':
        //to do
        return await this.scheduleLogout(body);
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
        return { msg: null };
    }
  }

  async scheduleLogout(body: UserDTO) {
    try {
      const timeoutDuration = 10 * 60 * 1000;
      const timeout = setTimeout(async () => {
        try {
          const guard = Number(this.config.get<number>('USER_GUARD_LOGOUT'));
          const activate = this.config.get<string>('USER_ACTIVITY_LOGOUT');

          const logBody: Login_logDTO = {
            id: body.id,
            activity: activate,
          };
          await this.login_logService.LogInsert(logBody, false);

          this.logger.debug(
            `user logout activity update ${body.id} :: ${body.activate}`,
          );

          return await commonQuery.UpdateGuard(
            this.userRepository,
            body.id,
            body.activate,
            guard,
          );
        } catch (E) {
          this.logger.error(`user logout error ${body.id}: ${E.message}`);
        }
      }, timeoutDuration); // 10분 후 실행

      this.schedulerRegistry.addTimeout(`${body.id}_logout`, timeout);

      return true;
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  async LoginLog_scheduleCancel(body: UserDTO) {
    try {
      const check = this.schedulerRegistry.getTimeouts();
      if (check.find((c) => c === `${body.id}_logout`)) {
        this.schedulerRegistry.deleteTimeout(`${body.id}_logout`);
      } else {
        const logModel: Login_logDTO = {
          id: body.id,
          activity: this.activate,
        };
        await this.login_logService.LogInsert(logModel, true);
      }

      return true;
    } catch (E) {
      console.log(E);
      return { msg: E };
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

  async userDelete(body: UserDTO) {
    try {
      let nboLogInsertBool = [];
      for (const i of body.nboIdx) {
        const result = await this.nboService.DeleteNbo(i);
        nboLogInsertBool.push(result);
      }

      if (nboLogInsertBool.every((b) => b === true)) {
        return await this.setDelete(body.id);
      } else {
        return { msg: 0 };
      }
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  async setDelete(id: string): Promise<any> {
    try {
      const result = await this.userRepository
        .createQueryBuilder()
        .update(UserEntity)
        .set({ pause: this.pause })
        .where({ id: id })
        .execute();
      return result.affected > 0;
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  async profileUpdate(body: UserDTO): Promise<any> {
    try {
      const profile = commonFun.getImageBuffer(body.profile);
      const imgupdate = commonFun.getDayjs();
      const result = await this.userRepository
        .createQueryBuilder()
        .update(UserEntity)
        .set({
          imgupdate: imgupdate,
          profile: profile,
        })
        .where({ idx: body.idx })
        .execute();
      console.log('profileUpdate');
      if (result.affected > 0) {
        this.positionSocket.UpdateImgupDate(body.idx, imgupdate);
        return imgupdate;
      }
      return { msg: 0 };
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
      const imgupdate = commonFun.getDayjs();
      const result = await this.setInsert(body, imgupdate);
      const positionBody: PositionDTO = {
        useridx: result,
        id: body.id,
        aka: body.aka,
        imgupdate: imgupdate,
      };
      console.log(positionBody);
      const userPositionResult =
        await this.positionService.InsertUserPosition(positionBody);
      return userPositionResult;
    } catch (E) {
      console.log('signUp' + E);
      return { msg: E };
    }
  }

  async setInsert(body: UserDTO, imgupdate: string): Promise<any> {
    try {
      const AESpwd = await pwBcrypt.transformPassword(body.pwd);
      let profile: Buffer;
      if (body.profile) {
        profile = commonFun.getImageBuffer(body.profile);
      } else {
        profile = null;
      }
      const result = await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(UserEntity)
        .values([
          {
            id: body.id,
            phone: body.phone,
            pwd: AESpwd,
            birth: body.birth,
            gender: body.gender,
            imgupdate: imgupdate,
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
      return result.identifiers.length > 0
        ? result.identifiers[0].idx
        : { msg: 0 };
    } catch (E) {
      console.log('setInsert : ' + E);
      return false;
    }
  }

  index = 0;

  getIdFromIndex() {
    switch (this.index) {
      case 0:
        return 'test';
      case 1:
        return 'tingtest';
      case 2:
        return 'test1004';
    }
  }

  async sendProfile(
    res: Response,
    idx: number,
    imgupdate: string,
  ): Promise<any> {
    try {
      if (this.index > 2) {
        this.index = 0;
      }
      const imgDate = imgupdate ? `imgupdate = '${imgupdate}'` : '1 = 1';
      const id = this.getIdFromIndex();
      const result: UserEntity = await this.userRepository
        .createQueryBuilder()
        .select('profile')
        .where({ id: 'test' })
        .getRawOne();
      // .andWhere(imgDate)
      // .where({"idx":idx})
      // .andWhere({ activate: this.activate })
      if (result.profile) {
        commonFun.ResponseImage(res, result.profile);
      } else {
        const default_profileImage = await commonFun.getDefault_ImageAsBuffer(
          this.path,
        );
        commonFun.ResponseImage(res, default_profileImage);
      }
      this.index += 1;
    } catch (E) {
      res.send({ msg: E });
    }
  }

  async getProfile(id: string): Promise<any> {
    try {
      const result = await this.userRepository
        .createQueryBuilder('a')
        .select(
          'a.idx,a.id,a.phone,a.birth,a.gender,a.profile,a.aka,a.imgupdate,b.visible',
        )
        .innerJoin(UserPositionEntity, 'b', 'a.idx = b.useridx')
        .where({ id: id })
        .getRawOne();
      const user = {
        idx: result.idx,
        id: id,
        phone: result.phone,
        birth: result.birth,
        gender: result.gender,
        aka: result.aka,
        visible: result.visible,
        imgupDate: result.imgupdate,
      };
      return commonFun.converterJson(user);
    } catch (E) {
      console.log('getProfile' + E);
      return false;
    }
  }

  async CheckLogin(body: UserDTO): Promise<boolean> {
    try {
      const result: UserEntity = await this.userRepository
        .createQueryBuilder()
        .select('pwd')
        .where({ id: body.id })
        .andWhere({ pause: this.use })
        .getRawOne();
      console.log('CheckLogin ', result);
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
      const login = Number(this.config.get<number>('USER_GUARD_LOGIN'));
      const logout = Number(this.config.get<number>('USER_GUARD_LOGOUT'));

      if (body.guard == logout) {
        //처음 로그인
        bool = await this.CheckLogin(body);
      } else if (body.guard == login) {
        // 자동 로그인시
        bool = await this.Login_sec(body, login);
      }

      if (bool) {
        const logModel: Login_logDTO = {
          id: body.id,
          activity: this.activate,
        };
        await this.login_logService.LogInsert(logModel, true);
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

        boolResult = result.length === 0;
      }
      console.log('checkIDDupe');
      return boolResult ? boolResult : { msg: 0 };
    } catch (E) {
      console.log('checkIDDupe : ' + E);
      return { msg: E };
    }
  }

  async updatePWD(body: UserDTO) {
    try {
      const AESpwd = await pwBcrypt.transformPassword(body.pwd);
      const result = await this.userRepository
        .createQueryBuilder()
        .update(UserEntity)
        .set({ pwd: AESpwd })
        .where({ id: body.id })
        .execute();
      console.log('updatePWD');
      return result.affected > 0;
    } catch (E) {
      console.log('updatePWD : ' + E);
      return { msg: E };
    }
  }

  async updateToken(body: UserDTO) {
    try {
      const result = await this.userRepository
        .createQueryBuilder()
        .update(UserEntity)
        .set({ alarm_token: body.alarm_token })
        .where({ id: body.id })
        .execute();
      console.log('updateToken');
      return result.affected > 0;
    } catch (E) {
      console.log('updateToken : ' + E);
      return { msg: E };
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
