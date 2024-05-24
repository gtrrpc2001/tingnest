import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity, CommentLogEntity } from 'src/entity/comment.entity';
import { CommentDTO } from 'src/dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @InjectRepository(CommentLogEntity)
    private commentLogRepository: Repository<CommentLogEntity>,
  ) {}

  async gubunKind(body: CommentDTO): Promise<any> {
    switch (body.kind) {
      case 'commentInsert':
        return await this.CommentInsert(body);
      case 'commentUpdate':
        return await this.CommentUpdate(body);
      case null:
        return { msg: 0 };
    }
  }

  async CommentInsert(body: CommentDTO): Promise<boolean | { msg: string }> {
    try {
      const result = await this.commentRepository
        .createQueryBuilder()
        .insert()
        .into(CommentEntity)
        .values([
          {
            id: body.id,
            postNum: body.postNum,
            aka: body.aka,
            content: body.content,
          },
        ])
        .execute();
      console.log('CommentInsert');
      return result.identifiers.length > 0;
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  async CommentLogInsert(postNum: number): Promise<boolean> {
    try {
      const commentArr = await this.getComment(postNum);
      let result;
      commentArr.forEach(async (c) => {
        result = await this.commentLogRepository
          .createQueryBuilder()
          .insert()
          .into(CommentLogEntity)
          .values([
            {
              id: c.id,
              postNum: c.postNum,
              aka: c.aka,
              likes: c.likes,
              content: c.content,
            },
          ])
          .execute();
      });
      console.log('CommentLogInsert');
      return result.identifiers.length > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async getComment(postNum: number): Promise<CommentEntity[]> {
    try {
      const result: CommentEntity[] = await this.commentRepository
        .createQueryBuilder()
        .select('*')
        .where({ postNum: postNum })
        .getRawMany();
      return result;
    } catch (E) {
      console.log(E);
    }
  }

  async CommentUpdate(body: CommentDTO): Promise<boolean | { msg: string }> {
    try {
      const result = await this.commentRepository
        .createQueryBuilder()
        .update(CommentEntity)
        .set({
          content: body.content,
          writetime: body.writetime,
        })
        .where({ idx: body.idx })
        .execute();
      return result.affected > 0;
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  //    async onlyArrCount(empid:string,startDate:string,endDate:string): Promise<string>{
  //     try{
  //       const result = await this.ecg_csv_ecgdata_arrRepository.createQueryBuilder('ecg_csv_ecgdata_arr')
  //                               .select('count(eq) as arrCnt')
  //                               .where({"eq":empid})
  //                               .andWhere({"writetime":MoreThan(startDate)})
  //                               .andWhere({"writetime":LessThan(endDate)})
  //                               .getRawOne()
  //         console.log(result)
  //         let Value = (result.length != 0 && empid != null)? commonFun.converterJson(result) : commonFun.converterJson('result = ' + '0')
  //         return Value;
  //     }catch(E){
  //       console.log(E)
  //       return commonFun.converterJson('result = ' + '0');
  //     }
  //    }

  //    async countArr (empid:string,startDate:string,endDate:string): Promise<string>{
  //     try{
  //       let Value = await this.onlyArrCount(empid,startDate,endDate)
  //       const info = await commonQuery.getProfile(this.userRepository,parentsEntity,empid,true)
  //       if(!Value.includes('result') && !info.includes('result')){
  //        const arr = Value?.replaceAll('{','')
  //        const profile = info?.replaceAll('}',',')
  //        console.log(profile)
  //        Value =  profile + arr
  //       }
  //       console.log(Value)
  //       return Value;
  //       //return Value
  //     } catch(E){
  //         console.log(E)
  //     }

  //  }

  //  async graphArrCount (empid:string,startDate:string,endDate:string,len:number):Promise<string>{
  //   try{
  //       const startLen = commonFun.getStartLen(len)
  //       console.log(`${startLen} -- ${len}`)
  //       const result = await this.ecg_csv_ecgdata_arrRepository.createQueryBuilder('ecg_csv_ecgdata_arr')
  //                       .select(`MID(writetime,${startLen},2) writetime,COUNT(ecgpacket) count`)
  //                       .where({"eq":empid})
  //                       .andWhere({"writetime":MoreThan(startDate)})
  //                       .andWhere({"writetime":LessThan(endDate)})
  //                       .groupBy(`MID(writetime,${startLen},2)`)
  //                       .having('COUNT(ecgpacket)')
  //                       .orderBy('writetime','ASC')
  //                       .getRawMany()
  //       const Value = (result.length != 0 && empid != null)? commonFun.converterJson(result) : commonFun.converterJson('result = ' + '0')
  //       return Value
  //   }catch(E){
  //     console.log(E)
  //   }
  //  }

  //  async arrWritetime (empid:string,startDate:string,endDate:string): Promise<string>{
  //   try{
  //     let result
  //     if(endDate != ''){
  //       result = await this.ecg_csv_ecgdata_arrRepository.createQueryBuilder('ecg_csv_ecgdata_arr')
  //                           .select('writetime,address')
  //                           .where({"eq":empid})
  //                           .andWhere({"writetime":MoreThan(startDate)})
  //                           .andWhere({"writetime":LessThan(endDate)})
  //                           .getRawMany()
  //     }else{
  //       result = await this.ecg_csv_ecgdata_arrRepository.createQueryBuilder()
  //                           .select('ecgpacket')
  //                           .where({"eq":empid})
  //                           .andWhere({"writetime":startDate})
  //                           .getRawMany()
  //     }
  //     const Value = (result.length != 0 && empid != null)? commonFun.converterJson(result) : commonFun.converterJson('result = ' + '0')
  //     console.log(empid)
  //     return Value;
  //   } catch(E){
  //       console.log(E)
  //   }

  // }

  //    async testArr (idx:number,empid:string,startDate:string,endDate:string): Promise<string>{
  //       try{
  //         let result
  //         if(endDate != ''){
  //           result = await this.ecg_csv_ecgdata_arrRepository.createQueryBuilder('ecg_csv_ecgdata_arr')
  //                               .select(this.testSel)
  //                               .where({"idx":MoreThan(idx)})
  //                               .andWhere({"eq":empid})
  //                               .andWhere({"writetime":MoreThan(startDate)})
  //                               .andWhere({"writetime":LessThan(endDate)})
  //                               .getRawMany()
  //         }else{
  //           result = await this.ecg_csv_ecgdata_arrRepository.createQueryBuilder()
  //                               .select(this.testSel)
  //                               .where({"idx":MoreThan(idx)})
  //                               .andWhere({"eq":empid})
  //                               .andWhere({"writetime":LessThan(endDate)})
  //                               .getRawMany()
  //         }
  //         const Value = (result.length != 0 && empid != null)? commonFun.convertCsv(commonFun.converterJson(result)) : commonFun.converterJson('result = ' + '0')
  //         console.log(empid)
  //         return Value;
  //       } catch(E){
  //           console.log(E)
  //       }

  //    }

  //    async arrPreEcgData (eq:string,date:string): Promise<string>{
  //     try{
  //       const subQuery = await this.subQueryArr(eq,date)
  //       const result = await this.ecg_csv_ecgdata_arrRepository.createQueryBuilder('a')
  //                                 .select('b.ecgpacket ecg , a.ecgpacket arr')
  //                                 .leftJoin(subQuery,'b','a.eq = b.eq AND b.writetime BETWEEN DATE_SUB(a.writetime,INTERVAL 4 SECOND) AND DATE_SUB(a.writetime,INTERVAL 2 SECOND)')
  //                                 .where({"eq":eq})
  //                                 .andWhere({"writetime":date})
  //                                 .getRawMany()
  //       const Value = (result.length != 0 && eq != null)? commonFun.converterJson(result) : commonFun.converterJson('result = ' + '0')
  //       return Value;
  //     }catch(E){
  //       console.log(E)
  //     }
  //    }

  //    async subQueryArr(eq:string,writetime:string): Promise<string>{
  //     const subSelect = 'eq,writetime,ecgpacket'
  //     const onlyDate = writetime.split(' ')[0]
  //     try{
  //       const result = await this.ecg_csv_ecgdataRepository.createQueryBuilder()
  //       .subQuery()
  //       .select(subSelect)
  //       .from(ecg_csv_ecgdataEntity,'')
  //       .where(`eq = '${eq}'`)
  //       .andWhere(`writetime <= '${writetime}'`)
  //       .andWhere(`writetime >= '${onlyDate}'`)
  //       .orderBy('writetime','DESC')
  //       .limit(6)
  //       .getQuery()
  //       return result
  //     }catch(E){
  //       console.log(E)
  //     }
  //   }
}
