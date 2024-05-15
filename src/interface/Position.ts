
export interface Position {
  clientId: string;
  aka: string;
  userIdx: number;
  userId: string;
  position: {
    latitude: number;
    longitude: number;
  };
}