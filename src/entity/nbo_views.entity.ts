import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('nbo_views')
export class NboViewsEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  id: string;

  @Column({ type: 'int' })
  nboidx: number;

  @Column({ type: 'datetime' })
  writetime: string;
}