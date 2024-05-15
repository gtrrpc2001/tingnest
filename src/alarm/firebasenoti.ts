import { isDefined } from 'class-validator';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';
import { alarmController } from './alarmController';
import { flutterNoti } from './flutterNoti';
import { AlarmDTO } from 'src/dto/alarm.dto';

export class firebasenoti{

  static initializeApp = (kind:admin.ServiceAccount) => {          
    admin.initializeApp({        
      credential: admin.credential.cert(kind),                
    });
}

static async PushNoti(body:AlarmDTO,configService:ConfigService,multi:boolean): Promise<boolean>{
    try{           
        await flutterNoti.FLUTTER(configService)
        if(multi){
          await this.setPushAlarmMulti(body)
        }else{
          await this.setPushAlarm(body)      
        }
      return true
    } catch(E){        
      console.log(E)
      console.log('alarm error')                  
      return false
    }          
}

static async setPushAlarm(body:AlarmDTO): Promise<boolean>{
  try{                          
   let title = body.title
   let content = body.content
   console.log('성공 ' + title)     
    await admin
    .messaging()    
    .send({      
      notification: {title:title,body:content},      
      token: body.token,
      android: {priority:'high'},
      apns:{
        payload:{
          aps:{
            // sound: bodystate == 1 ? 'heartAttackSound.wav' :'basicsound.wav'
          }                
        }
      }
    })
    .catch((error: any) => {
      console.error(error)
      return false;
    })
    return true;
  }catch(E){
    console.log(E)
    return false;
  }    
}

static async setPushAlarmMulti(body:AlarmDTO): Promise<boolean>{
  try{                          
   let title = body.title
   let content = body.content
   console.log('성공 ' + title)     
    await admin
    .messaging()    
    .sendEachForMulticast({
      notification: {title,body:content},
      tokens: body.tokens,
      android: {priority:'high'},
      apns:{
        payload:{
          aps:{
            // sound: bodystate == 1 ? 'heartAttackSound.wav' :'basicsound.wav'
          }                
        }
      }
    })
    .catch((error: any) => {
      console.error(error)
      return false;
    })
    return true;
  }catch(E){
    console.log(E)
    return false;
  }    
}
}