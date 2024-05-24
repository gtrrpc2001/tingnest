import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firebasenoti } from 'src/alarm/firebasenoti';
import { AlarmDTO } from 'src/dto/alarm.dto';

@Injectable()
export class AlarmService {
  constructor(private config: ConfigService) {}

  async gubunKind(body: AlarmDTO): Promise<any> {
    switch (body.kind) {
      case 'one':
        return await firebasenoti.PushNoti(body, this.config, false);
      case 'multi':
        return await firebasenoti.PushNoti(body, this.config, true);
      case null:
        return false;
    }
  }
}
