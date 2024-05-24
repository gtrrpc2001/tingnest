import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('sms')
export class SmsEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'datetime' })
  writetime: string;
}
