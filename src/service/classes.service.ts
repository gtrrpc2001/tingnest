import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan, MoreThanOrEqual } from 'typeorm';
import { ClassesEntity } from 'src/entity/classes.entity';
import { commonFun } from 'src/clsfunc/commonfunc';
import { ClassesDTO } from 'src/dto/classes.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(ClassesEntity)
    private classesRepository: Repository<ClassesEntity>,
  ) {}

  async gubunKind(body: ClassesDTO) {
    switch (body.kind) {
      case 'insert':
        return await this.Insert_Classes(body);
      case 'select':
        return;
      case 'update':
        return;
      case null:
        return { msg: null };
    }
  }

  async Insert_Classes(body: ClassesDTO) {
    try {
      const values = this.getInserValues(body);
      
      const result = await this.classesRepository
        .createQueryBuilder()
        .insert()
        .into(ClassesEntity)
        .values([values])
        .execute();

      console.log('Insert_Classes');
      return result.identifiers.length > 0;
    } catch (E) {
      console.log(E);
      return { msg: E };
    }
  }

  getInserValues(body: ClassesDTO) {    
    let background_img;
    if (body.background_img) {
      background_img = commonFun.getImageBuffer(body.background_img);
    } else {
      background_img = null
    }

    let profile_img;
    if (body.profile_img) {
      profile_img = commonFun.getImageBuffer(body.profile_img);
    } else {
      profile_img = null
    }

    const values = {
      id: body.id,
      background_img: background_img,
      profile_img: profile_img,
      writetime: body.writetime,
      title: body.title,
      content: body.content,
    };

    return values
  }

  // async updateLast(body:ecg_csv_ecgdataDTO): Promise<boolean>{
  //   try{
  //     console.log(`${body.timezone}`)
  //     const timezone = body.timezone.includes('+') ? body.timezone : (body.timezone.includes('-') ? body.timezone : ('+' + body.timezone).trim())
  //       //const result = await this.ecg_raw_history_lastRepository.createQueryBuilder()
  //       //.update(ecg_raw_history_lastEntity)
  //       //.set({"writetime":body.writetime ,"hrv":body.hrv,"cal":body.cal,"calexe":body.calexe,"step":body.step,
  //       //  "distanceKM":body.distanceKM,"arrcnt":body.arrcnt,"temp":body.temp,"timezone":timezone,"battery":body.battery,
  //       //  "isack":body.isack,"log":body.log
  //       //  })
  //       //.where({"eq":body.eq})
  //       //.execute()
  //       console.log('updateLast')
  //       return true;
  //   }catch(E){
  //       console.log(E)
  //       return false;
  //   }
  // }

  // async setInsert(body:ecg_csv_ecgdataDTO):Promise<boolean>{
  //   try{
  //     const result = await this.ecg_csv_bpmdayRepository.createQueryBuilder()
  //     .insert()
  //     .into(ecg_csv_bpmdayEntity)
  //     .values([{
  //         eq:body.eq,timezone:body.timezone,writetime:body.writetime,bpm:body.bpm,
  //         temp:body.temp,hrv:body.hrv
  //     }])
  //     .execute()
  //     return true
  //   }catch(E){
  //     console.log(E)
  //     return false
  //   }
  // }

  //  async BpmData (empid:string,startDate:string,endDate:string): Promise<string>{
  //   console.log('BpmData')
  //   const result = await commonQuery.whereIfResult(this.ecg_csv_bpmdayRepository,this.table,this.select,empid,startDate,endDate);
  //   const Value = (result.length != 0 && empid != null)? commonFun.convertCsv(commonFun.converterJson(result))  : commonFun.converterJson('result = ' + '0')
  //   return Value;
  //   }

  // async getWebBpm(
  //   empid: string,
  //   startDate: string,
  //   endDate: string,
  // ): Promise<string> {
  //   try {
  //     const select = 'bpm,hrv,writetime';
  //     const result = await this.ecg_csv_bpmdayRepository
  //       .createQueryBuilder(this.table)
  //       .select(select)
  //       .where({ eq: empid })
  //       .andWhere({ writetime: MoreThan(startDate) })
  //       .andWhere({ writetime: LessThan(endDate) })
  //       .orderBy('MID(writetime,12,8)', 'ASC')
  //       .getRawMany();
  //     return commonFun.converterJson(result);
  //   } catch (E) {
  //     console.log(E);
  //   }
  // }

  // async webGraphBpmHrvArr(
  //   empid: string,
  //   startDate: string,
  //   endDate: string,
  // ): Promise<string> {
  //   try {
  //     const subQuery = await this.subQueryArr(empid, startDate, endDate);
  //     const result = await this.ecg_csv_bpmdayRepository
  //       .createQueryBuilder('a')
  //       .select('a.writetime,a.bpm,a.hrv,b.count')
  //       .leftJoin(
  //         subQuery,
  //         'b',
  //         'MID(a.writetime,1,18) = MID(b.writetime,1,18)',
  //       )
  //       .where({ eq: empid })
  //       .andWhere({ writetime: MoreThanOrEqual(startDate) })
  //       .andWhere({ writetime: LessThan(endDate) })
  //       .orderBy('writetime', 'ASC')
  //       .getRawMany();
  //     return commonFun.converterJson(result);
  //   } catch (E) {
  //     console.log(E);
  //   }
  // }

  async subQueryArr(
    eq: string,
    writetime: string,
    endDate: string,
  ): Promise<string> {
    const subSelect = 'COUNT(ecgpacket) count,writetime';
    try {
      //const result = await this.ecg_csv_ecgdata_arrRepository.createQueryBuilder()
      //.subQuery()
      //.select(subSelect)
      //.from(ecg_csv_ecgdata_arrEntity,'')
      //.where(`eq = '${eq}'`)
      //.andWhere(`writetime >= '${writetime}'`)
      //.andWhere(`writetime < '${endDate}'`)
      //.groupBy('writetime')
      //.having('COUNT(ecgpacket)')
      //.getQuery()
      //return result
      return '';
    } catch (E) {
      console.log(E);
    }
  }
}
