import { isDefined } from 'class-validator';
import * as fs from 'fs';
import { Response } from 'express';
import { Readable } from 'stream';
import * as dayjs from 'dayjs';

export class commonFun {  

  static getDayjs = (): string => {
    const result = dayjs(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    return result;
  };

  static converterJson(result: any) {
    return JSON.stringify(result);
  }

  static async getDefault_ImageAsBase64(filePath: string): Promise<string> {
    try {
      const imageBuffer = await fs.promises.readFile(filePath);
      const imageBase64 = this.getImageBase64(imageBuffer);
      return imageBase64;
    } catch (error) {
      console.log('파일을 읽는 중 오류가 발생했습니다: ' + error.message);
    }
  }

  static async getDefault_ImageAsBuffer(filePath: string): Promise<Buffer> {
    try {
      const imageBuffer = await fs.promises.readFile(filePath);
      return imageBuffer;
    } catch (error) {
      console.log('파일을 읽는 중 오류가 발생했습니다: ' + error.message);
    }
  }

  static getTokens(parentsArr: any[]): string[] {
    let tokens: string[] = [];
    let i = 0;
    for (const parents of parentsArr) {
      if (isDefined(parents.token)) {
        tokens[i] = parents.token;
        i += 1;
      }
    }
    return tokens;
  }

  static getImageBuffer(image: number[]): Buffer {
    const uint8Arr = new Uint8Array(image);
    const arrBuffer = uint8Arr.buffer;
    const buffer = Buffer.from(arrBuffer);
    return buffer;
  }

  static getImageBase64(image: Buffer): string {
    const profileJson = this.converterJson(image);
    const encodedStr = Buffer.from(profileJson).toString('base64');
    return encodedStr;
  }

  static ResponseImage = (res: Response, image: Buffer) => {
    const readableStream = new Readable({
      read() {
        this.push(image);
        this.push(null);
      },
    });
    readableStream.pipe(res);

    // 응답 스트림이 끝났을 때 res.end()를 호출하여 응답을 종료합니다.
    readableStream.on('end', () => {
      if (!res.writableEnded) {
        res.end();
      }
    });

    // 에러 처리
    readableStream.on('error', (err) => {
      console.error('Stream error:', err);
      if (!res.headersSent) {
        res.status(500).send({ msg: err });
      }
    });

    res.on('finish', () => {
      console.log('Response finished');
    });
  };
}
