import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ecg_byteController } from "src/controller/ecg_byte.controller";
import { ecg_byteEntity } from "src/entity/ecg_byte.entity";
import { ecg_byteService } from "src/service/ecg_byte.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([ecg_byteEntity])
    ],
    controllers:[ecg_byteController],
    providers:[ecg_byteService]
})
export class ecg_byteModule {}