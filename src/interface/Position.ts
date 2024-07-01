export interface Position {
  clientId: string;
  aka: string;
  userIdx: number;
  position: rect;
  visible:number; //0 invisible , 1 visible
  imgupDate?:string;
}

export interface rect {
  lat: number;
  lng: number;
}
