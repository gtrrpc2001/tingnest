import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('nbo_img')
export class NboImgEntity{

    @PrimaryGeneratedColumn()
    idx: number;

    @Column({type:'varchar'})
    id:string;

    @Column({type:'int'})
    nboidx:Int32;

    @Column({type:'blob'})
    nboImg:Buffer;

    @Column({type:'datetime'})
    writetime:string;             
}

@Entity('nbo_img_log')
export class nboImgLogEntity{

    @PrimaryGeneratedColumn()
    idx: number;

    @Column({type:'varchar'})
    id:string;

    @Column({type:'int'})
    nboidx:Int32;

    @Column({type:'blob'})
    nboImg:Buffer;

    @Column({type:'datetime'})
    writetime:string;             
}