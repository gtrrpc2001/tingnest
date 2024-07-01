import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Login_logEntity } from 'src/entity/login_log.entity';
import { UserEntity } from 'src/entity/user.entity';
import { Login_logService } from 'src/service/login_log.service';

@Module({
  imports: [TypeOrmModule.forFeature([Login_logEntity, UserEntity])],
  exports: [Login_logService],
  controllers: [],
  providers: [Login_logService],
})
export class Login_logModule {}
