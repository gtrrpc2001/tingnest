import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('user_position')
export class UserPositionEntity {
  @PrimaryGeneratedColumn()
  idx: number;
  @Column({ type: 'int' })
  useridx: number;

  @Column({ type: 'varchar' })
  id: string;

  @Column({ type: 'datetime' })
  writetime: string;

  @Column({ type: 'datetime' })
  imgupDate: string;

  @Column({ type: 'double' })
  latitude: number;

  @Column({ type: 'double' })
  longitude: number;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar' })
  aka: string;

  @Column({ type: 'tinyint' })
  visible: number;
}

@Entity('position')
export class PositionEntity {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: 'varchar' })
  id: string;

  @Column({ type: 'datetime' })
  writetime: string;

  @Column({ type: 'double' })
  latitude: number;

  @Column({ type: 'double' })
  longitude: number;

  @Column({ type: 'varchar' })
  address: string;
}
