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

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'datetime' })
  create_at: string;

  @Column({ type: 'datetime' })
  writetime: string;

  @Column({ type: 'varchar' })
  content: string;  

  @Column({ type: 'varchar' })
  location: string;

  @Column({ type: 'datetime' })
  appointment: string;

  @Column({ type: 'smallint' })
  max_participants: number;

  @Column({ type: 'smallint' })
  current_participants: number;  

  @Column({ type: 'tinyint' })
  is_private: number;  

  @Column({ type: 'smallint' })
  code: number;  
}

@Entity('classes_log')
export class ClassesLogEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  id: string;

  @Column({ type: 'longblob' })
  background_img: Buffer;

  @Column({ type: 'mediumblob' })
  profile_img: Buffer;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'datetime' })
  create_at: string;

  @Column({ type: 'datetime' })
  writetime: string;

  @Column({ type: 'varchar' })
  content: string;  

  @Column({ type: 'varchar' })
  location: string;

  @Column({ type: 'datetime' })
  appointment: string;

  @Column({ type: 'smallint' })
  max_participants: number;

  @Column({ type: 'smallint' })
  current_participants: number;  

  @Column({ type: 'tinyint' })
  is_private: number;  

  @Column({ type: 'smallint' })
  code: number;  
}
