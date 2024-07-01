import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PositionService } from './position.service';
import { PositionManager } from 'src/manager/position.manager';
import { PositionDTO } from 'src/dto/position.dto';
import { Position, rect } from 'src/interface/Position';
import * as dayjs from 'dayjs';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class UserPositionEventGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private positionService: PositionService
    ) {}

  private positionManager = new PositionManager();

  private visible = Number(process.env.USER_VISIBLE_SHOW)

  @WebSocketServer() server: Server;

  handleConnection = async (client: Socket, args: Position) => {
    //사용자 id 값 , 위도 경도 값 저장  push 부분
    client.emit('join', client.id);

    //테스트용이므로 나중에 주석 달기
    await this.getUserPosition();

    console.log('connect success', client.id);
  };

  handleDisconnect(client: Socket) {
    //사용자 id 값 , 위도 경도 값 삭제 remove 부분
    this.positionManager.removePosition(client.id);
    console.log('disconnect success', client.id);
  }

  @SubscribeMessage('requestUserPositionData')
 async handleUserPositionDataRequest(client: Socket, payload: { mapRect: rect[],visible:number }) {
    //위도 경도 바뀐 user만 값 반환
    console.log('DataOn');    
    //필요한 정보 보내기        
    if(payload.visible == this.visible){
      console.log(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'));      
      const result = this.positionManager.getPosition(client.id, payload);
      console.log(result.length);
      client.emit('UserPositionData', result);
    }else{            
      client.emit('UserPositionData', []);
    }
    console.log('DataOff');
  }

  @SubscribeMessage('requestUpdate')
  async handleRequestUpdate(client: Socket, payload: Position) {
    //update user position
    console.log('UpdateOn');

    //필요한 정보 보내기
    this.positionManager.AddOrUpdatePosition(client.id, payload);

    //서버로 정보 보내기
    await this.updatePosition(payload);
    console.log('UpdateOff');
  }

  UpdateImgupDate(idx: number, imgupdate: string) {
    this.positionManager.UpdateImgupDate(idx,imgupdate)  
    return this.positionManager.getUser(idx)
  }

  getUserPosition = async () => {
    const userList = await this.positionService.GetUserPosition('test');
    if (userList) {      
      userList.forEach((user, index) => {        
        this.positionManager.AddOrUpdatePosition(index.toString(), {
          clientId: index.toString(),
          aka: user.aka,
          userIdx: user.useridx,
          position: {
            lat: user.latitude,
            lng: user.longitude,
          },
          visible: user.visible,
          imgupDate:user.imgupdate
        });
      });      
    }
  };

  updatePosition = async (body: Position) => {
    try {
      const model = this.changeToDto(body);
      await this.positionService.InsertPosition(model);
      console.log('updatePosition');
    } catch (E) {
      console.log(E);
    }
  };

  changeToDto = (body: Position): PositionDTO => {
    const model: PositionDTO = {
      useridx: body.userIdx,
      latitude: body.position.lat,
      longitude: body.position.lng,
      aka: body.aka,      
    };
    return model;
  };
}
