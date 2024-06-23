import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('nbocomment_img')
export class CommentImgEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  id: string;  

  @Column({ type: 'int' })
  commentidx: number;

  @Column({ type: 'longblob' })
  commentImg: Buffer;

  @Column({ type: 'datetime' })
  writetime: string;
}

@Entity('nbocomment_img_log')
export class CommentImgLogEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  id: string;  

  @Column({ type: 'int' })
  commentidx: number;

  @Column({ type: 'longblob' })
  commentImg: Buffer;

  @Column({ type: 'datetime' })
  writetime: string;
}

@Entity('nbocmt_cmt_img')
export class Cmt_cmtImgEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  id: string;  

  @Column({ type: 'int' })
  commentidx: number;

  @Column({ type: 'longblob' })
  commentImg: Buffer;

  @Column({ type: 'datetime' })
  writetime: string;
}

@Entity('nbocmt_cmt_img_log')
export class Cmt_cmtImgLogEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  id: string;  

  @Column({ type: 'int' })
  commentidx: number;

  @Column({ type: 'longblob' })
  commentImg: Buffer;

  @Column({ type: 'datetime' })
  writetime: string;
}