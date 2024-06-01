import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('class_user')
export class Class_userEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  id: string;

  @Column({ type: 'int' })
  class_idx: number;

  @Column({ type: 'datetime' })
  writetime: string;
}
