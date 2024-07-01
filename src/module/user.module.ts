import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/controller/user.controller';
import { UserEntity } from 'src/entity/user.entity';
import { UserService } from 'src/service/user.service';
import { Login_logModule } from './Login_log.module';
import { PositionModule } from './position.module';
import { NboModule } from './nbo.module';
import { UserPositionEventGateway } from 'src/service/UserPositionEventGateway.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    Login_logModule,
    PositionModule,
    NboModule    
  ],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService,UserPositionEventGateway],
})
export class UserModule {}
