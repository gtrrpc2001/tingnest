import * as admin from 'firebase-admin';
import { staticConfigValue } from 'src/config/staticConfigValue';
import { ConfigService } from '@nestjs/config';
import { firebasenoti } from './firebasenoti';

export class flutterNoti{

  static flutter:admin.ServiceAccount

  static privateID = ""

    static setPath = (configService:ConfigService)  => {                      
        this.flutter = staticConfigValue.getFirebase_sdk(configService)
        this.privateID = this.flutter.projectId
    }   

    static async FLUTTER(configService:ConfigService): Promise<boolean>{
      try{                    
        if(this.privateID == ""){
          this.setPath(configService);                        
          firebasenoti.initializeApp(this.flutter)            
        }
        return true    
        }catch(E){
          console.log('여기서 빠짐')           
          console.log(E) 
           return false
        }
    }
      
}