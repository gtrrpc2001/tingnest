import {
  HttpStatus,
  Inject,
  Injectable,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CACHE_MANAGER } from '@nestjs/cache-manager';
import * as crypto from 'crypto';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosRequestConfig } from 'axios';
import { UserService } from 'src/service/user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { SmsEntity } from 'src/entity/sms.entity';
import * as dayjs from 'dayjs';

@Injectable()
@UseInterceptors(CacheInterceptor)
export class SmsService {
  constructor(
    @InjectRepository(SmsEntity) private smsRepository: Repository<SmsEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly config: ConfigService, // .env
    private readonly userService: UserService,
  ) {}

  accessKey = this.config.get('NAVER_ACCESSKEY');

  getUrl = () => {
    const naver_ID = this.config.get('NAVER_SERVICEID');
    return `/sms/v2/services/${naver_ID}/messages`;
  };

  // SMS 인증 위한 시그니쳐 생성 로직
  makeSignatureForSMS = (time: string): string => {
    const secretKey: string = this.config.get('NAVER_SECRETKEY');
    let message = [];
    const hmac = crypto.createHmac('sha256', secretKey);
    const timeStamp = time;
    const space = ' ';
    const newLine = '\n';
    const method = 'POST';
    const url = this.getUrl();
    message.push(method);
    message.push(space);
    message.push(url);
    message.push(newLine);
    message.push(timeStamp);
    message.push(newLine);
    message.push(this.accessKey);
    //시그니처 생성
    const signature = hmac.update(message.join('')).digest('base64');

    //string 으로 반환
    return signature.toString();
  };

  checkDayCount = async (phoneNumber: string): Promise<boolean> => {
    try {
      let key: string = phoneNumber + 'smscount';

      const dayCount: number = await this.smsCount(phoneNumber);

      console.log('sms 인증 횟수 ' + dayCount);
      if (dayCount > 5) return false;

      return true;
    } catch (E) {
      console.log(E);
      return false;
    }
  };

  smsCount = async (phoneNumber: string): Promise<number> => {
    try {
      const timeDay = dayjs(new Date()).format('YYYY-MM-DD');
      const result = await this.smsRepository
        .createQueryBuilder()
        .select('COUNT(*) AS count')
        .where({ phone: phoneNumber })
        .andWhere({ writetime: Like(`%${timeDay}%`) })
        .getRawOne();
      let { count } = result;
      if (count == undefined) count = 0;
      return count;
    } catch (E) {
      console.log(E);
      return 0;
    }
  };

  sendSms = async (
    id: string,
    phoneNumber: string,
    check: boolean = true,
  ): Promise<any> => {
    // 회원가입 때 check = true, 아이디 및 비번 찾기때 check = false
    const checkUser = await this.userService.checkUserPhone(phoneNumber);
    console.log(checkUser, check);
    if (check) {
      if (!checkUser) return { msg: 0 };
    } else {
      if (checkUser) return { msg: 2 }; //가입 안된 핸드폰번호
    }

    const writetime = Date.now().toString();

    if (check) if (!(await this.checkDayCount(phoneNumber))) return { msg: 1 };

    if (id) {
      const resultID = await this.userService.getID(id);
      if (resultID == null) return { msg: 2 };
    }

    const signature = this.makeSignatureForSMS(writetime);

    // 캐시에 있던 데이터 삭제
    await this.cacheManager.del(phoneNumber);

    // 난수 생성 (6자리로 고정)
    const checkNumber = this.makeOTP().toString().padStart(6, '0');

    const sendNumber: string = this.config.get('COMPANYNUMBER');

    const body = {
      type: 'SMS',
      contentType: 'COMM',
      countryCode: '82',
      from: sendNumber,
      content: `ting 어플 인증번호 [${checkNumber}] 입니다.`,
      messages: [
        {
          to: phoneNumber,
        },
      ],
    };

    console.log(body);

    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'x-ncp-apigw-timestamp': writetime,
      'x-ncp-iam-access-key': this.accessKey,
      'x-ncp-apigw-signature-v2': signature,
    };

    const signatureUrl = this.getUrl();
    const url = `https://sens.apigw.ntruss.com${signatureUrl}`;
    try {
      const result = await axios
        .post(url, body, { headers })
        .then(async () => {
          // 캐시 추가하기
          await this.cacheManager.set(phoneNumber, checkNumber, 180000);
          await this.insertSMS(id, phoneNumber);
          return true;
        })
        .catch((error) => {
          console.log(HttpStatus.INTERNAL_SERVER_ERROR);
          console.log(error);
          return error;
        });
      return result;
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  };

  //인증번호 발송 성공시 db 저장
  insertSMS = async (id: string, phoneNumber: string) => {
    try {
      const time = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss');
      const result = await this.smsRepository
        .createQueryBuilder()
        .insert()
        .into(SmsEntity)
        .values([{ id: id, phone: phoneNumber, writetime: time }])
        .execute();
    } catch (E) {
      console.log(E);
    }
  };

  // SMS 확인 로직, 문자인증은 3분 이내에 입력해야지 가능합니다!
  checkSMS = async (phoneNumber: string, inputNumber: number): Promise<any> => {
    try {
      const sentNumber = await this.cacheManager.get(phoneNumber);
      if (sentNumber != null)
        return Number(sentNumber) == inputNumber ? true : { msg: 0 };
      else return { msg: 1 };
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  };

  // 무작위 6자리 랜덤 번호 생성하기
  makeOTP = (): number => {
    const randNum = Math.floor(Math.random() * 1000000);
    return randNum;
  };
}
