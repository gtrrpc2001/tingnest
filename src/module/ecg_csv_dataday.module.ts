import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ecg_csv_datadayController } from 'src/controller/ecg_csv_dataday.controller';
import { ecg_csv_datadayService } from 'src/service/ecg_csv_dataday.service';


@Module({
    // imports:[
    //     TypeOrmModule.forFeature([ecg_csv_datadayEntity])
    // ],
    // controllers:[ecg_csv_datadayController],
    // providers:[ecg_csv_datadayService]
})
export class ecg_csv_datadayModule {}