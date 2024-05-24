import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('nbo')
export class NboEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  id: string;

  @Column({ type: 'datetime' })
  writetime: string;

  @Column({ type: 'varchar' })
  aka: string;

  @Column({ type: 'int' })
  likes: Int32;

  @Column({ type: 'varchar' })
  vilege: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'longblob' })
  Img: Buffer;
}

@Entity('nbo_log')
export class NboLogEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  id: string;

  @Column({ type: 'datetime' })
  writetime: string;

  @Column({ type: 'varchar' })
  aka: string;

  @Column({ type: 'int' })
  likes: Int32;

  @Column({ type: 'varchar' })
  vilege: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'longblob' })
  Img: Buffer;
}
