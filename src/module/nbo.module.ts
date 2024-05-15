import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { nboController } from 'src/controller/nbo.controller';
import { CommentEntity } from 'src/entity/comment.entity';
import { NboEntity } from 'src/entity/nbo.entity';
import { NboImgEntity } from 'src/entity/profileLog.entity';
import { CommentService } from 'src/service/comment.service';
import { NboService } from 'src/service/nbo.service';
import { NboImgService } from 'src/service/nboimg.service';



@Module({
    imports:[
        TypeOrmModule.forFeature([NboEntity,NboImgEntity,CommentEntity])
    ],
    controllers:[nboController],
    providers:[NboService,NboImgService,CommentService]
})
export class NboModule {}