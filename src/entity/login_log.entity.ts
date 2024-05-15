import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('login_log')
export class Login_logEntity{

    @PrimaryGeneratedColumn()
    idx: number;

    @Column({type:'varchar'})
    id:string;

    @Column({type:'datetime'})
    writetime:string;  
    
    @Column({type:'varchar'})
    activity:string;
}