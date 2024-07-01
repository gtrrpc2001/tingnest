import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('nbo_comment')
export class CommentEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  id: string;

  @Column({ type: 'datetime' })
  writetime: string;

  @Column({ type: 'datetime' })
  imgupdate: string;

  @Column({ type: 'int' })
  useridx: number;

  @Column({ type: 'int' })
  postNum: number;

  @Column({ type: 'varchar' })
  aka: string;

  @Column({ type: 'int' })
  likes: number;

  @Column({ type: 'varchar' })
  content: string;  

  @Column({ type: 'tinyint' })
  isImg: number;

  @Column({ type: 'smallint' })
  commentes: number;

  @Column({ type: 'tinyint' })
  pause: number;
}

@Entity('nbocmt_cmt')
export class Cmt_cmtEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  id: string;

  @Column({ type: 'datetime' })
  writetime: string;

  @Column({ type: 'datetime' })
  imgupdate: string;

  @Column({ type: 'int' })
  useridx: number;

  @Column({ type: 'int' })
  commentNum: number;

  @Column({ type: 'int' })
  nboNum: number;  

  @Column({ type: 'varchar' })
  aka: string;

  @Column({ type: 'int' })
  likes: number;

  @Column({ type: 'varchar' })
  content: string; 

  @Column({ type: 'tinyint' })
  isImg: number;
  
  @Column({ type: 'tinyint' })
  pause: number;
}