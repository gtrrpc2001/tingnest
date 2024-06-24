import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { LikesDTO } from 'src/dto/likes.dto';
import { Cmt_cmtEntity, CommentEntity } from 'src/entity/comment.entity';
import {
  Cmtcmt_LikesEntity,
  Comment_LikesEntity,
  Nbo_LikesEntity,
} from 'src/entity/likes.entity';
import { NboEntity } from 'src/entity/nbo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Nbo_LikesEntity)
    private nbo_LikesRepository: Repository<Nbo_LikesEntity>,
    @InjectRepository(NboEntity) private nboRepository: Repository<NboEntity>,
    @InjectRepository(Comment_LikesEntity)
    private comment_LikesRepository: Repository<Comment_LikesEntity>,
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(Cmtcmt_LikesEntity)
    private cmtCmt_LikesRepository: Repository<Cmtcmt_LikesEntity>,
    @InjectRepository(Cmt_cmtEntity)
    private cmtCmtRepository: Repository<Cmt_cmtEntity>,
    private config: ConfigService,
  ) { }

  use: number = this.config.get<number>('USE');
  pause: number = this.config.get<number>('PAUSE');

  async gubunKind(body: LikesDTO) {
    switch (body.kind) {
      case 'insertNbo_likes':
        return await this.InsertNbo_Likes(body);
      case 'insertComment_likes':
        return await this.InsertComment_Likes(body);
      case 'insertCmtcmt_likes':
        return await this.InsertCmtcmt_Likes(body);
      case 'deleteNbo_likes':
        return await this.DeleteNbo_Likes(body);
      case 'deleteComment_likes':
        return await this.DeleteComment_Likes(body);
      case 'deleteCmtcmt_likes':
        return await this.DeleteCmtcmt_Likes(body);
      case 'Check_Likes':
        return await this.Check_Likes(body)
      case 'Check_Nbo_Likes':
        return await this.Check_Nbo_Likes(body);
      case 'Check_Comment_Likes':
        return await this.Check_Comment_Likes(body);
      case 'Check_Cmtcmt_Likes':
        return await this.Check_Cmtcmt_Likes(body);
      default:
        return { msg: 0 };
    }
  }

  async InsertNbo_Likes(
    body: LikesDTO,
  ): Promise<boolean | { msg: string | number }> {
    try {
      const existingLike = await this.Check_Nbo_Likes(body);
      if (existingLike) {
        return { msg: '이미 좋아요를 누르셨습니다' };
      }

      const result = await this.nbo_LikesRepository
        .createQueryBuilder()
        .insert()
        .into(Nbo_LikesEntity)
        .values([
          {
            id: body.id,
            nbo_idx: body.nbo_idx,
          },
        ])
        .execute();

      if (result.identifiers.length > 0) {
        return await this.UpdateNbo_Likes(body.nbo_idx);
      }
      return { msg: 0 };
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  async UpdateNbo_Likes(idx: number): Promise<boolean> {
    try {
      const result = await this.nboRepository
        .createQueryBuilder()
        .update(NboEntity)
        .set({ likes: () => 'likes + 1' })
        .where({ idx: idx })
        .execute();
      return result.affected > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async InsertComment_Likes(
    body: LikesDTO,
  ): Promise<boolean | { msg: string | number }> {
    try {
      const existingLike = await this.Check_Comment_Likes(body);
      if (existingLike) {
        return { msg: '이미 좋아요를 누르셨습니다' };
      }
      const result = await this.comment_LikesRepository
        .createQueryBuilder()
        .insert()
        .into(Comment_LikesEntity)
        .values([
          {
            id: body.id,
            nbo_idx: body.nbo_idx,
            comment_idx: body.comment_idx,
          },
        ])
        .execute();

      if (result.identifiers.length > 0) {
        return await this.UpdateComment_Likes(body.comment_idx);
      }

      return { msg: 0 };
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  async InsertCmtcmt_Likes(
    body: LikesDTO,
  ): Promise<boolean | { msg: string | number }> {
    try {
      const existingLike = await this.Check_Cmtcmt_Likes(body);
      if (existingLike) {
        return { msg: '이미 좋아요를 누르셨습니다' };
      }
      const result = await this.comment_LikesRepository
        .createQueryBuilder()
        .insert()
        .into(Cmtcmt_LikesEntity)
        .values([
          {
            id: body.id,
            nbo_idx: body.nbo_idx,
            comment_idx: body.comment_idx,
            cmt_idx: body.cmtCmt_idx,
          },
        ])
        .execute();

      if (result.identifiers.length > 0) {
        return await this.UpdateCmtcmt_Likes(body.cmtCmt_idx);
      }

      return { msg: 0 };
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  async UpdateComment_Likes(idx: number): Promise<boolean> {
    try {
      const result = await this.commentRepository
        .createQueryBuilder()
        .update(CommentEntity)
        .set({ likes: () => 'likes + 1' })
        .where({ idx: idx })
        .execute();
      return result.affected > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async UpdateCmtcmt_Likes(idx: number): Promise<boolean> {
    try {
      const result = await this.cmtCmtRepository
        .createQueryBuilder()
        .update(Cmt_cmtEntity)
        .set({ likes: () => 'likes + 1' })
        .where({ idx: idx })
        .execute();
      return result.affected > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async DeleteNbo_Likes(
    body: LikesDTO,
  ): Promise<boolean | { msg: string | number }> {
    try {
      const existingLike = await this.Check_Nbo_Likes(body);

      if (!existingLike) {
        return { msg: '좋아요 누르지 않았어요!!' };
      }

      const result = await this.nbo_LikesRepository.update(
        {
          id: body.id,
          nbo_idx: body.nbo_idx,
        },
        { pause: this.pause },
      );

      if (result.affected > 0) {
        const likesResult = await this.Nbo_LikesDecrease(body.nbo_idx);
        return likesResult;
      } else {
        return { msg: '좋아요 취소 했습니다.!!' };
      }
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  async Nbo_LikesDecrease(nbo_idx: number): Promise<boolean> {
    try {
      const result = await this.nboRepository
        .createQueryBuilder()
        .update(NboEntity)
        .set({ likes: () => 'likes - 1' })
        .where('likes > 0 AND idx = :idx', { idx: nbo_idx })
        .execute();

      return result.affected > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async DeleteComment_Likes(
    body: LikesDTO,
  ): Promise<boolean | { msg: string | number }> {
    try {
      const existingLike = await this.Check_Comment_Likes(body);

      if (!existingLike) {
        return { msg: '좋아요 누르지 않았어요!!' };
      }

      const result = await this.comment_LikesRepository.update(
        {
          id: body.id,
          comment_idx: body.comment_idx,
        },
        { pause: this.pause },
      );

      if (result.affected > 0) {
        const likesResult = await this.Comment_LikesDecrease(body.comment_idx);        
        return likesResult;
      } else {
        return { msg: '좋아요 취소 했습니다.!!' };
      }
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  async DeleteCmtcmt_Likes(
    body: LikesDTO,
  ): Promise<boolean | { msg: string | number }> {
    try {
      const existingLike = await this.Check_Cmtcmt_Likes(body);

      if (!existingLike) {
        return { msg: '좋아요 누르지 않았어요!!' };
      }

      const result = await this.cmtCmt_LikesRepository.update(
        {
          id: body.id,
          cmt_idx: body.cmtCmt_idx,
        },
        { pause: this.pause },
      );

      if (result.affected > 0) {
        const likesResult = await this.Cmtcmt_LikesDecrease(body.cmtCmt_idx);
        return likesResult;
      } else {
        return { msg: '좋아요 취소 했습니다.!!' };
      }
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  async Comment_LikesDecrease(comment_idx: number): Promise<boolean> {
    try {
      const result = await this.commentRepository
        .createQueryBuilder()
        .update(CommentEntity)
        .set({ likes: () => 'likes - 1' })
        .where('likes > 0 AND idx = :idx', { idx: comment_idx })
        .execute();
      console.log(comment_idx)
      return result.affected > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async Cmtcmt_LikesDecrease(cmt_idx: number): Promise<boolean> {
    try {
      const result = await this.cmtCmtRepository
        .createQueryBuilder()
        .update(Cmt_cmtEntity)
        .set({ likes: () => 'likes - 1' })
        .where('likes > 0 AND idx = :idx', { idx: cmt_idx })
        .execute();

      return result.affected > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async Check_Likes(body: LikesDTO) {
    try {
      const nbo_Likes = await this.Check_Nbo_LikesList(body.id)
      const comment_Likes = await this.Check_Comment_LikesList(body.id)
      const cmtCmt_Likes = await this.Check_Cmtcmt_LikesList(body.id)
      const result = {
        nboLikes: nbo_Likes,
        commentLikes: comment_Likes,
        cmtCmtLikes: cmtCmt_Likes
      }
      console.log('Check_Likes ', result)
      return result
    } catch (E) {
      console.log(E)
      return { msg: E }
    }
  }

  async Check_Nbo_Likes(body: LikesDTO): Promise<boolean> {
    try {
      const existingLike = await this.nbo_LikesRepository.findOne({
        where: { id: body.id, nbo_idx: body.nbo_idx, pause: this.use },
      });

      return existingLike ? true : false;
    } catch (E) {
      console.log('Check_Nbo_Likes');
      return false;
    }
  }

  async Check_Comment_Likes(body: LikesDTO): Promise<boolean> {
    try {
      const existingLike = await this.comment_LikesRepository.findOne({
        where: { id: body.id, comment_idx: body.comment_idx, pause: this.use },
      });
      console.log('Check_Comment_Likes');
      return existingLike ? true : false;
    } catch (E) {
      console.log('Check_Comment_Likes', E);
      return false;
    }
  }

  async Check_Nbo_LikesList(id: string) {
    try {
      const existingLike = await this.nbo_LikesRepository.find({
        select: ['nbo_idx'],
        where: { id: id, pause: this.use },
      });
      return existingLike.map(e => e.nbo_idx);      
    } catch (E) {
      console.log('Check_Nbo_LikesList ', E);
      return [];
    }
  }

  async Check_Comment_LikesList(id: string): Promise<number[]> {
    try {
      const existingLike = await this.comment_LikesRepository.find({
        select: ['comment_idx'],
        where: { id: id, pause: this.use },
      });
      console.log('Check_Comment_LikesList');
      return existingLike.map(e => e.comment_idx);
    } catch (E) {
      console.log('Check_Comment_LikesList', E);
      return [];
    }
  }

  async Check_Cmtcmt_LikesList(id: string): Promise<number[]> {
    try {
      const existingLike = await this.cmtCmt_LikesRepository.find({
        select: ['cmt_idx'],
        where: {
          id: id,
          pause: this.use,
        },
      });
      console.log('Check_Cmtcmt_LikesList');
      return existingLike.map(e => e.cmt_idx);
    } catch (E) {
      console.log('Check_Cmtcmt_LikesList', E);
      return [];
    }
  }

  async Check_Cmtcmt_Likes(body: LikesDTO): Promise<boolean> {
    try {
      const existingLike = await this.cmtCmt_LikesRepository.findOne({
        where: {
          id: body.id,
          cmt_idx: body.cmtCmt_idx,
          pause: this.use,
        },
      });
      console.log('Check_Cmtcmt_Likes');
      return existingLike ? true : false;
    } catch (E) {
      console.log('Check_Cmtcmt_Likes', E);
      return false;
    }
  }
}
