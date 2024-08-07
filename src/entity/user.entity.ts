import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar', unique: true })
  phone: string;

  @Column({ type: 'varchar' })
  pwd: string;

  @Column({ type: 'date' })
  birth: string;

  @Column({ type: 'varchar' })
  gender: string;

  @Column({ type: 'datetime' })
  signupdate: string;

  @Column({ type: 'tinyint' })
  pause: number;

  @Column({ type: 'datetime' })
  imgupDate: string;

  @Column({ type: 'mediumblob' })
  profile: Buffer;

  @Column({ type: 'varchar' })
  aka: string;

  @Column({ type: 'tinyint' })
  guard: Int32;

  @Column({ type: 'varchar' })
  activate: string;

  @Column({ type: 'varchar' })
  access_token: string;

  @Column({ type: 'varchar' })
  refresh_token: string;

  @Column({ type: 'varchar' })
  alarm_token: string;
}