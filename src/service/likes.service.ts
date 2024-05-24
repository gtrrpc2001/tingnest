import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikesDTO } from 'src/dto/likes.dto';
import { CommentEntity } from 'src/entity/comment.entity';
import { Comment_LikesEntity, Nbo_LikesEntity } from 'src/entity/likes.entity';
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
  ) {}
  async gubunKind(body: LikesDTO): Promise<any> {
    switch (body.kind) {
      case 'insertNbo_likes':
        return await this.InsertNbo_Likes(body);
      case 'insertComment_likes':
        return await this.InsertComment_Likes(body);
      case 'deleteNbo_likes':
        return await this.DeleteNbo_Likes(body);
      case 'deleteComment_likes':
        return await this.DeleteComment_Likes(body);
      default:
        return false;
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

  async UpdateComment_Likes(idx: number): Promise<boolean> {
    try {
      const result = await this.commentRepository
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

  async Check_Nbo_Likes(body: LikesDTO): Promise<boolean> {
    try {
      const existingLike = await this.nbo_LikesRepository.findOne({
        where: { id: body.id, nbo_idx: body.nbo_idx },
      });

      return existingLike ? true : false;
    } catch (E) {
      console.log('Check_Nbo_Likes');
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

      const result = await this.nbo_LikesRepository.delete({
        id: body.id,
        nbo_idx: body.nbo_idx,
      });

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

      const result = await this.comment_LikesRepository.delete({
        id: body.id,
        comment_idx: body.comment_idx,
      });

      if (result.affected > 0) {
        const likesResult = await this.Comment_LikesDecrease(body.nbo_idx);
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

      return result.affected > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async Check_Comment_Likes(body: LikesDTO): Promise<boolean> {
    try {
      const existingLike = await this.comment_LikesRepository.findOne({
        where: { id: body.id, comment_idx: body.comment_idx },
      });

      return existingLike ? true : false;
    } catch (E) {
      console.log('Check_Comment_Likes');
      return false;
    }
  }
}
