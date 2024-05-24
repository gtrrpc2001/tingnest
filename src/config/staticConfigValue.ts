import { ConfigService } from '@nestjs/config';

export class staticConfigValue {
  static getFirebase_sdk = (configService: ConfigService) => {
    return {
      projectId: configService.get<string>('PRIVATE_ID'),
      clientEmail: configService.get<string>('CLIENT_EMAIL'),
      privateKey: configService
        .get<string>('PRIVATE_KEY')
        .replace(/\\n/g, '\n'),
    };
  };
}
