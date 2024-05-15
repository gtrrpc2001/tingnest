import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionController } from 'src/controller/position.controller';
import { PositionEntity, UserPositionEntity } from 'src/entity/user_position.entity';
import { PositionService } from 'src/service/position.service';
import { UserPositionEventGateway } from 'src/service/UserPositionEventGateway.service';

@Module({
    imports:[
        TypeOrmModule.forFeature([PositionEntity,UserPositionEntity])
    ],
    exports:[PositionService],
    controllers:[],
    providers:[PositionService,UserPositionEventGateway]
})
export class PositionModule {}