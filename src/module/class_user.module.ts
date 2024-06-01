import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class_userController } from 'src/controller/class_user.controller';
import { Class_userEntity } from 'src/entity/class_user.entity';
import { Class_userService } from 'src/service/class_user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Class_userEntity])],
  controllers: [Class_userController],
  providers: [Class_userService],
})
export class Class_userModule {}
