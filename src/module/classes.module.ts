import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesController } from 'src/controller/classes.controller';
import { ClassesEntity } from 'src/entity/classes.entity';
import { ClassesService } from 'src/service/classes.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClassesEntity])],
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}
