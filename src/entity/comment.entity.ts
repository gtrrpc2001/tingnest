import { Entity, Column, PrimaryGeneratedColumn, Double, Int32 } from 'typeorm';

@Entity('nbo_comment')
export class CommentEntity{

    @PrimaryGeneratedColumn()
    idx: number;

    @Column({type:'varchar'})
    id:string;

    @Column({type:'datetime'})
    writetime:string;      

    @Column({type:'int'})
    postNum:Int32;
    
    @Column({type:'varchar'})
    aka:string;

    @Column({type:'int'})
    likes:Int32;

    @Column({type:'varchar'})
    content:string; 
}

@Entity('nbo_comment_log')
export class CommentLogEntity{

    @PrimaryGeneratedColumn()
    idx: number;

    @Column({type:'varchar'})
    id:string;

    @Column({type:'datetime'})
    writetime:string;      

    @Column({type:'int'})
    postNum:Int32;
    
    @Column({type:'varchar'})
    aka:string;

    @Column({type:'int'})
    likes:Int32;

    @Column({type:'varchar'})
    content:string; 
}