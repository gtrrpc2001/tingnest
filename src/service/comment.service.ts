import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from 'src/entity/comment.entity';

@Injectable()
export class CommentService {  
  
  constructor(
    @InjectRepository(CommentEntity) private commentRepository:Repository<CommentEntity>,
    // private configService:ConfigService
    ){}

//     table = 'ecg_csv_ecgdata_arr'
//     select = 'writetime,ecgpacket'
//     testSel = 'idx,writetime,ecgpacket,address'


//   async gubunKind(body:ecg_csv_ecgdataDTO): Promise<any>{   
//     switch(body.kind){
//         case "arrEcgData" :
//             return this.arrEcgData (body.eq,body.startDate,body.endDate);
//         case "arrEcgInsert":
//             return this.insertEcgPacket(body);
//         case null  :
//             return commonFun.converterJson('result = ' + false.toString());
//     } 
//   }

//   async insertEcgPacket(body:ecg_csv_ecgdataDTO): Promise<string>{
//     var boolResult = false
//     try{    
//         const arrInsert = await this.setInsert(body)  
//         if(arrInsert){
//           const parentsArr = await this.getSelToken(body)           
//           boolResult = await this.callPushAlarm(parentsArr,body)
//           //console.log(`boolean 값 안받아짐 -- ${boolResult}`)
//         }        
//         var jsonValue = `result =  ${boolResult}`
//         return commonFun.converterJson(jsonValue);
//     }catch(E){
//         console.log(E)
//         return E;
//     }  
    
//   }

//   async callPushAlarm(parentsArr:parentsEntity[],body:ecg_csv_ecgdataDTO):Promise<boolean>{
//     try{
//       if(parentsArr.length != 0){
//         let tokens : string[] = commonFun.getTokens(parentsArr)
//         let i = 0;                
//         if(tokens.length != 0)
//           return await firebasenoti.PushNoti(tokens,body,this.configService)
//         else
//           return false;
//        }
//     }catch{
//       return false;
//     }
    
//   }

//   async getSelToken(body:ecg_csv_ecgdataDTO) : Promise<parentsEntity[]>{
//     try{
//       const result = await this.parentsRepository.createQueryBuilder('parents')
//       .select('token')
//       .where({"eq":body.eq})
//       .getRawMany()
//       return result;
//     }catch(E){
//       console.log(E)
//     }    
//   }

//   async setInsert(body:ecg_csv_ecgdataDTO): Promise<boolean>{
//     try{
//       const result = await this.ecg_csv_ecgdata_arrRepository.createQueryBuilder()
//       .insert()
//       .into(ecg_csv_ecgdata_arrEntity)
//       .values([{
//           eq:body.eq,writetime:body.writetime,bodystate:body.bodystate,ecgpacket:body.ecgPacket,address:body.address
//       }])
//       .execute()
//       console.log('arrinsert')
//       return true
//     }catch(E){
//       console.log(E)
//     }    
//   }

//    async arrEcgData (empid:string,startDate:string,endDate:string): Promise<string>{    
//     console.log('arrEcgData')
//       try{
//         const result = await commonQuery.whereIfResult(this.ecg_csv_ecgdata_arrRepository,this.table,this.select,empid,startDate,endDate);     
//         const Value = (result.length != 0 && empid != null)? commonFun.convertCsv(commonFun.converterJson(result)) : commonFun.converterJson('result = ' + '0')
//         return Value;    
//       } catch(E){
//           console.log(E)
//       }                 
    
//    }

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