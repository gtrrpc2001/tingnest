import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { SmsService } from '../service/sms.service';
import { SmsController } from 'src/controller/sms.controller';
import { SmsEntity } from 'src/entity/sms.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsCachConfigService } from 'src/service/cache.service';
import { UserModule } from './user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SmsEntity]),
    CacheModule.registerAsync({
      useClass: SmsCachConfigService,
      inject: [SmsCachConfigService],
    }),
    UserModule,
  ],
  providers: [SmsService],
  controllers: [SmsController],
})
export class SmsModule {}
