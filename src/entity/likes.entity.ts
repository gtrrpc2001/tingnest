import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('nbo_likes')
export class Nbo_LikesEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  id: string;

  @Column({ type: 'int' })
  nbo_idx: number;

  @Column({ type: 'datetime' })
  writetime: string;

  @Column({ type: 'tinyint' })
  pause: number;
}

@Entity('comment_likes')
export class Comment_LikesEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  id: string;

  @Column({ type: 'int' })
  nbo_idx: number;

  @Column({ type: 'int' })
  comment_idx: number;

  @Column({ type: 'datetime' })
  writetime: string;

  @Column({ type: 'tinyint' })
  pause: number;
}

@Entity('cmt_cmt_likes')
export class Cmtcmt_LikesEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  id: string;

  @Column({ type: 'int' })
  nbo_idx: number;

  @Column({ type: 'int' })
  comment_idx: number;

  @Column({ type: 'int' })
  cmt_idx: number;

  @Column({ type: 'datetime' })
  writetime: string;

  @Column({ type: 'tinyint' })
  pause: number;
}
