import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server ,Socket} from 'socket.io';
import { PositionService } from './position.service';
import { PositionManager } from 'src/manager/position.manager';
import { PositionDTO } from 'src/dto/position.dto';
import { Position } from 'src/interface/Position';

@WebSocketGateway({
  cors:{
    origin:'*',
  },
})
export class UserPositionEventGateway implements OnGatewayConnection,OnGatewayDisconnect{
  constructor(
    private positionService:PositionService
  ){}

  private positionManager = new PositionManager();

  @WebSocketServer() server:Server;

  handleConnection = async (client: Socket, args: Position) => {
    //사용자 id 값 , 위도 경도 값 저장  push 부분
    client.emit('join',client.id)

    await this.getUserPosition()

    console.log('connect success',client.id)    
  }

  handleDisconnect(client: Socket) {
    //사용자 id 값 , 위도 경도 값 삭제 remove 부분 
    this.positionManager.removePosition(client.id)
    console.log('disconnect success',client.id)
  }

  @SubscribeMessage('requestUserPositionData')
  handleUserPositionDataRequest(client: Socket, payload:{latitude: number; longitude: number; zoomLevel:number}){
    //위도 경도 바뀐 user만 값 반환        
    console.log('DataOn')

    //필요한 정보 보내기

    const result = this.positionManager.getPosition(client.id,payload)
    
    client.emit('UserPositionData',result)

    console.log('DataOff')    
  }

  @SubscribeMessage('requestUpdate')
  async handleRequestTest(client: Socket, payload:Position){
    //update user position    
    console.log('UpdateOn')   

    //필요한 정보 보내기
    this.positionManager.AddOrUpdatePosition(client.id,payload)

    //서버로 정보 보내기
    await this.updatePosition(payload)
    console.log('UpdateOff')
  }
  
  getUserPosition = async () => {
    const userList = await this.positionService.GetUserPosition("test")
    if(userList){
      userList.map((user,index) => {
        this.positionManager.AddOrUpdatePosition(index,{
          clientId: index,
          aka: user.aka,
          userIdx: user.useridx,
          userId: user.id,
          position: {
            latitude: user.latitude,
            longitude: user.longitude
          }
        })
      })
    }    
  }

  updatePosition = async (body:Position) => {
    try{      
      const model = this.changeToDto(body)
      await this.positionService.InsertPosition(model)
      console.log('updatePosition')
    }catch(E){
      console.log(E)      
    }
  }

  changeToDto = (body:Position):PositionDTO => {
      const model:PositionDTO = {useridx:body.userIdx,id:body.userId,latitude:body.position.latitude,longitude:body.position.longitude,aka:body.aka}      
      return model
  }
}

