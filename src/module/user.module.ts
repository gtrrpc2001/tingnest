import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/controller/user.controller';
import { DelUserLogEntity, UserEntity } from 'src/entity/user.entity';
import { UserService } from 'src/service/user.service';
import { Login_logModule } from './Login_log.module';
import { PositionModule } from './position.module';
import { NboModule } from './nbo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, DelUserLogEntity]),
    Login_logModule,
    PositionModule,
    NboModule    
  ],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
