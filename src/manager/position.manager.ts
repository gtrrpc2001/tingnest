import { Position } from "src/interface/Position";

export class PositionManager{
    private positions: Position[] = [];



    AddOrUpdatePosition(clientId:string,newPosition:Position){
        if(this.positions.length != 0){
            const index = this.getIndex(clientId,true)
    
            if(index !== -1){
                // 사용자 정보 업데이트
                this.positions[index] = newPosition;
            }else{
                // 새로운 사용자            
                this.removePosition(newPosition.userId,false)
                this.positions.push(newPosition)
            }
        }else{
            this.positions.push(newPosition)
        }
        
    }

    getIndex(value:string,useClientId:boolean){
        const index = this.positions.findIndex(p => 
            useClientId ? p.clientId === value : p.userId === value
            );
        return index
    }

    removePosition(value:string,useClientId:boolean = true){
        if(this.positions.length != 0){
            const index = this.getIndex(value,useClientId)
            if(index !== -1){
                this.positions.splice(index,1)
            }
        }
    }

    getPosition(clientId:string,userPosition:{latitude:number,longitude:number,zoomLevel:number}){  
       const result = this.positions.filter(p => {
            if (p.clientId != clientId){
                // return p;                                
                const distance = this.calculateDistance(userPosition.latitude,userPosition.longitude,p.position.latitude,p.position.longitude)
                const phoneMapDistance = this.zoomLevelControl(userPosition.zoomLevel)
               if(distance <= phoneMapDistance){
                    return p
               } 
            }
        })

        return result;
    }

    zoomLevelControl(zoomlevel:number):number{
        const check = `${zoomlevel}`.includes('.')
        if(check){
            const levelStr = `${zoomlevel}`.split('.')        
            const intLevel = Number(levelStr[0])
            const pointLevel = Number(`0.${levelStr[1]}`)
            const phoneDistance = this.zoomLevelDistance(intLevel)
            const nextLevel = intLevel < 8 ? intLevel + 1 : intLevel
            const nextDistance =  this.zoomLevelDistance(nextLevel)       
            const gapDistance = nextDistance - phoneDistance
            const result = this.zoomLevelDistanceCalculate(phoneDistance,gapDistance,pointLevel)
            return result;
        }else{
            return this.zoomLevelDistance(zoomlevel)
        }        
       
    }

    zoomLevelDistance(intLevel:number):number{
        switch (intLevel) {
            case 21:
                return 2;
            case 20:
                return 5;
            case 19:
                return 10;
            case 18:
                return 20;
            case 17:
                return 50;
            case 16:
                return 100;
            case 15:
                return 200;
            case 14:
                return 500;
            case 13:
                return 1000;
            case 12:
                return 2000;
            case 11:
                return 3500;
            case 10:
                return 5000;
            case 9:
                return 10000;
            case 8:
                return 20000;
            default:
                return 100;
        }
    }

    zoomLevelDistanceCalculate(originDistance:number,gap:number,zoomlevalPointNumber:number):number{       
        return originDistance + (gap * zoomlevalPointNumber)
    }

    calculateDistance(userLat: number, userLon: number, otherLat: number, otherLon: number): number {
        const R = 6371e3; // 지구의 반지름(m)
        const φ1 = userLat * Math.PI/180; // φ, λ in radians
        const φ2 = otherLat * Math.PI/180;
        const Δφ = (otherLat-userLat) * Math.PI/180;
        const Δλ = (otherLon-userLon) * Math.PI/180;
    
        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
        const distance = R * c; // in metres
        return distance;
    }


}