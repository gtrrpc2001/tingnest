import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { nboController } from 'src/controller/nbo.controller';
import { CommentEntity, CommentLogEntity } from 'src/entity/comment.entity';
import { NboEntity, NboLogEntity } from 'src/entity/nbo.entity';
import { NboImgEntity, nboImgLogEntity } from 'src/entity/nboImg.entity';
import { CommentService } from 'src/service/comment.service';
import { NboService } from 'src/service/nbo.service';
import { NboImgService } from 'src/service/nboimg.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NboEntity,
      NboLogEntity,
      nboImgLogEntity,
      NboImgEntity,
      CommentEntity,
      CommentLogEntity,
    ]),
  ],
  controllers: [nboController],
  providers: [NboService, NboImgService, CommentService],
  exports: [NboService]
})
export class NboModule {}
