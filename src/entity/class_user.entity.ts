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
  joined_at: string;

  @Column({ type: 'tinyint' })
  status: number;

  @Column({ type: 'tinyint' })
  role: number;
}

@Entity('class_user_log')
export class Class_userLogEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  id: string;

  @Column({ type: 'int' })
  class_idx: number;

  @Column({ type: 'datetime' })
  joined_at: string;

  @Column({ type: 'tinyint' })
  status: number;

  @Column({ type: 'tinyint' })
  role: number;
}
