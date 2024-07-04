import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('ecg_csv_bpmday')
export class ecg_csv_bpmdayEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  eq: string;

  @Column({ type: 'varchar' })
  timezone: string;

  @Column({ type: 'datetime' })
  writetime: string;

  @Column({ type: 'int' })
  bpm: Int32;

  @Column({ type: 'double' })
  temp: Double;

  @Column({ type: 'int' })
  hrv: Int32;
}
