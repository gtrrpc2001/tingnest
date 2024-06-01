import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MySqlMslConfigFactory } from 'src/factory/mysqlconfig.factory';
import { UserModule } from 'src/module/user.module';
import { PositionModule } from 'src/module/position.module';
import { NboModule } from 'src/module/nbo.module';
import { CommentModule } from 'src/module/comment.module';
import { SmsModule } from 'src/module/sms.module';
import { Login_logModule } from 'src/module/Login_log.module';
import { AppversionModule } from 'src/module/appversion.module';
import { AlarmModule } from 'src/module/alarm.module';
import { LikesModule } from 'src/module/likes.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ClassesModule } from 'src/module/classes.module';
import { Class_userModule } from 'src/module/class_user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ServeStaticFactory } from 'src/factory/serveStatic.factory';

export class allModule {
  static appImport = [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      useClass: MySqlMslConfigFactory,
      inject: [MySqlMslConfigFactory],
    }),
    ServeStaticModule.forRootAsync({useClass:ServeStaticFactory}),
    UserModule,
    PositionModule,
    NboModule,
    CommentModule,
    SmsModule,
    Login_logModule,
    AppversionModule,
    AlarmModule,
    LikesModule,
    ScheduleModule.forRoot(),
    ClassesModule,
    Class_userModule,    
  ];
}
