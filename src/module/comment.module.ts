import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cmt_cmtEntity, CommentEntity } from 'src/entity/comment.entity';
import {
  Cmt_cmtImgEntity,
  Cmt_cmtImgLogEntity,
  CommentImgEntity,
  CommentImgLogEntity,
} from 'src/entity/comment_img.entity';
import { CommentService } from 'src/service/comment.service';
import { CommentImgService } from 'src/service/commentimg.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentEntity,
      CommentImgEntity,
      Cmt_cmtEntity,
      Cmt_cmtImgEntity,
      CommentImgLogEntity,
      Cmt_cmtImgLogEntity,
    ]),
  ],
  controllers: [],
  providers: [CommentService, CommentImgService],
  exports: [CommentService, CommentImgService],
})
export class CommentModule {}
