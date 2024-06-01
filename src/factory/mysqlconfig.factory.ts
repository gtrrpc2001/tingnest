import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class MySqlMslConfigFactory implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>('HOST'),
      port: +this.configService.get<number>('PORT'),
      username: this.configService.get<string>('NAME'),
      password: this.configService.get<string>('PASSWORD'),
      database: this.configService.get<string>('DATABASE'),
      entities: ['dist/entity/*.entity.{js,ts}'],
      synchronize: false,
      //timezone:'Asia/Seoul',
      dateStrings: true,
    };
  }
}
