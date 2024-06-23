import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesController } from 'src/controller/likes.controller';
import { Cmt_cmtEntity, CommentEntity } from 'src/entity/comment.entity';
import { Cmtcmt_LikesEntity, Comment_LikesEntity, Nbo_LikesEntity } from 'src/entity/likes.entity';
import { NboEntity } from 'src/entity/nbo.entity';
import { LikesService } from 'src/service/likes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Nbo_LikesEntity,
      Comment_LikesEntity,
      NboEntity,
      CommentEntity,
      Cmtcmt_LikesEntity,
      Cmt_cmtEntity
    ]),
  ],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
