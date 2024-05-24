import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { commonFun } from 'src/clsfunc/commonfunc';
import { AppversionDTO } from 'src/dto/appversion.dto';
import { AppversionEntity } from 'src/entity/appversion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppversionService {
  constructor(
    @InjectRepository(AppversionEntity)
    private appversionRepository: Repository<AppversionEntity>,
  ) {}

  async getVersion(admin: string): Promise<string> {
    try {
      const result = await this.appversionRepository
        .createQueryBuilder()
        .select('appversion')
        .where({ admin: admin })
        .getRawOne();
      return commonFun.converterJson(result);
    } catch (E) {
      console.log(E);
    }
  }

  async updateVersion(body: AppversionDTO): Promise<string> {
    try {
      const result = await this.appversionRepository
        .createQueryBuilder()
        .update(AppversionEntity)
        .set({
          appversion: body.appversion,
        })
        .where({ admin: body.admin })
        .execute();
      return true.toString();
    } catch (E) {
      console.log(E);
      return false.toString();
    }
  }
}
