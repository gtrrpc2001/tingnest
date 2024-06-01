import { Position, rect } from 'src/interface/Position';

export class PositionManager {
  private positions: Position[] = [];
  private visible = Number(process.env.USER_VISIBLE_SHOW);

  AddOrUpdatePosition(clientId: string, newPosition: Position) {
    if (this.positions.length != 0) {
      const index = this.getIndex(clientId, true);
      if (index !== -1) {
        // 사용자 정보 업데이트
        this.positions[index] = newPosition;
      } else {
        // 새로운 사용자
        this.removePosition(newPosition.userIdx, false);
        this.positions.push(newPosition);
      }
    } else {
      this.positions.push(newPosition);
    }
  }

  getIndex(value: any, useClientId: boolean) {
    const index = this.positions.findIndex((p) =>
      useClientId ? p.clientId === value : p.userIdx === value,
    );
    return index;
  }

  removePosition(value: any, useClientId: boolean = true) {
    if (this.positions.length != 0) {
      const index = this.getIndex(value, useClientId);
      if (index !== -1) {
        this.positions.splice(index, 1);
      }
    }
  }

  getPosition(clientId: string, userPosition: { mapRect: rect[] }) {
    if (userPosition) {
      const result = this.positions.filter((p) => {
        if (p.clientId != clientId) {
          const check = this.checkIsPointInRectangle(
            p.position,
            userPosition.mapRect,
            p.visible,
          );          
          if (check) return p;
        }
      });
      return result;
    }
  }

  //사용자 중심 다른 사용자 거리 계산
  calculateDistance(
    userLat: number,
    userLon: number,
    otherLat: number,
    otherLon: number,
  ): number {
    const R = 6371e3; // 지구의 반지름(m)
    const φ1 = (userLat * Math.PI) / 180; // φ, λ in radians
    const φ2 = (otherLat * Math.PI) / 180;
    const Δφ = ((otherLat - userLat) * Math.PI) / 180;
    const Δλ = ((otherLon - userLon) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // in metres
    return Math.floor(distance);
  }

  //핸드폰 지도 화면 거리 계산
  findFurthestPointsDistance(points: { lat: number; lon: number }[]): number {
    let maxDistance = 0;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const distance = this.calculateDistance(
          points[i].lat,
          points[i].lon,
          points[j].lat,
          points[j].lon,
        );
        if (distance > maxDistance) {
          maxDistance = distance / 2;
        }
      }
    }
    return Math.floor(maxDistance);
  }

  checkIsPointInRectangle(
    userPoint: rect,
    rectanglePoints: rect[],
    visible: number,
  ): boolean {
    const lats = rectanglePoints.map((point) => point.lat);
    const lons = rectanglePoints.map((point) => point.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    
    return (
      userPoint.lat >= minLat &&
      userPoint.lat <= maxLat &&
      userPoint.lng >= minLon &&
      userPoint.lng <= maxLon &&
      visible == this.visible
    );
  }
}
