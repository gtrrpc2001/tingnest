import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { nboController } from 'src/controller/nbo.controller';
import { CommentEntity } from 'src/entity/comment.entity';
import { NboEntity, NboLogEntity } from 'src/entity/nbo.entity';
import { NboImgEntity, nboImgLogEntity } from 'src/entity/nboImg.entity';
import { NboSearchEntity } from 'src/entity/nbo_search.entity';
import { NboViewsEntity } from 'src/entity/nbo_views.entity';
import { CommentService } from 'src/service/comment.service';
import { NboService } from 'src/service/nbo.service';
import { NboImgService } from 'src/service/nboimg.service';
import { CommentModule } from './comment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NboEntity,
      NboLogEntity,
      nboImgLogEntity,
      NboImgEntity,
      NboViewsEntity,
      NboSearchEntity
    ]),
    CommentModule
  ],
  controllers: [nboController],
  providers: [NboService, NboImgService],
  exports: [NboService]
})
export class NboModule {}
