import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ecg_csv_bpmdayController } from 'src/controller/ecg_csv_bpmday.controller';
import { ecg_csv_bpmdayEntity } from 'src/entity/ecg_csv_bpmday.entity';
import { ecg_csv_bpmdayService } from 'src/service/ecg_csv_bpmday.service';


@Module({
    imports:[
        TypeOrmModule.forFeature([ecg_csv_bpmdayEntity])
    ],
    controllers:[ecg_csv_bpmdayController],
    providers:[ecg_csv_bpmdayService]
})
export class ecg_csv_bpmdayModule {}