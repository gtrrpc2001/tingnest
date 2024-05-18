
export interface Position {
  clientId: string;
  aka: string;
  userIdx: number;
  position: {
    latitude: number;
    longitude: number;
  };
}