import { Module} from '@nestjs/common';
import { AlarmController } from 'src/controller/alarm.controller';
import { AlarmService } from 'src/service/alarm.service';


@Module({
    imports:[],
    controllers:[AlarmController],
    providers:[AlarmService]
})
export class AlarmModule {}