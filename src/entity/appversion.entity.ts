import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('app_version')
export class AppversionEntity{

    @PrimaryGeneratedColumn()
    idx: number;

    @Column({type:'varchar'})
    admin:string;   
    
    @Column({type:'varchar'})
    appversion:string;   
}