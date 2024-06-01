import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('classes')
export class ClassesEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  id: string;

  @Column({ type: 'longblob' })
  background_img: Buffer;

  @Column({ type: 'mediumblob' })
  profile_img: Buffer;

  @Column({ type: 'datetime' })
  writetime: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  content: string;  
}
