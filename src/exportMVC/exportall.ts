import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MySqlMslConfigService } from 'src/service/mysqlconfig.service';
import { UserModule } from 'src/module/user.module';
import { PositionModule } from 'src/module/position.module';
import { NboModule } from 'src/module/nbo.module';
import { CommentModule } from 'src/module/comment.module';
import { SmsModule } from 'src/module/sms.module';
import { Login_logModule } from 'src/module/Login_log.module';
import { AppversionModule } from 'src/module/appversion.module';
import { AlarmModule } from 'src/module/alarm.module';
import { LikesModule } from 'src/module/likes.module';

export class allModule {
  static appImport = [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      useClass: MySqlMslConfigService,
      inject: [MySqlMslConfigService],
    }),
    UserModule,
    PositionModule,
    NboModule,
    CommentModule,
    SmsModule,
    Login_logModule,
    AppversionModule,
    AlarmModule,
    LikesModule,
    //  ecg_csv_bpmdayModule,
    // admin_login_logModule,
    // parentsModule,app_logModule,app_bleModule
  ];
}
