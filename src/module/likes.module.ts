import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikesController } from 'src/controller/likes.controller';
import { CommentEntity } from 'src/entity/comment.entity';
import { Comment_LikesEntity, Nbo_LikesEntity } from 'src/entity/likes.entity';
import { NboEntity } from 'src/entity/nbo.entity';
import { LikesService } from 'src/service/likes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Nbo_LikesEntity,
      Comment_LikesEntity,
      NboEntity,
      CommentEntity,
    ]),
  ],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
