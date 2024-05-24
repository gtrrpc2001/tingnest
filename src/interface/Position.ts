export interface Position {
  clientId: string;
  aka: string;
  userIdx: number;
  position: rect;
}

export interface rect {
  lat: number;
  lng: number;
}
