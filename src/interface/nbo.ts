import { CommentDTO } from 'src/dto/comment.dto';

export interface NboInterface {
  idx: number;
  writetime: string;
  useridx: number;
  aka: string;
  likes: number;
  vilege: string;
  subject: string;
  title: string;
  content: string;
  commentCount:number;
  imgupDate:string;
  imgIdxArr: number[];
  commentDto: CommentDTO[];
}
