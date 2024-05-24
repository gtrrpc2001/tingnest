import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppversionController } from 'src/controller/appversion.controller';
import { AppversionEntity } from 'src/entity/appversion.entity';
import { AppversionService } from 'src/service/appversion.service';

@Module({
  imports: [TypeOrmModule.forFeature([AppversionEntity])],
  controllers: [AppversionController],
  providers: [AppversionService],
})
export class AppversionModule {}
