import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServeStaticModuleOptions, ServeStaticModuleOptionsFactory } from '@nestjs/serve-static';
import { join } from 'path';

@Injectable()
export class ServeStaticFactory implements ServeStaticModuleOptionsFactory {
  constructor(private config: ConfigService) {}
    createLoggerOptions(): ServeStaticModuleOptions[] {
        const path1 = this.config.get<string>('PATH1')
        const path2 = this.config.get<string>('PATH2')
        const image = this.config.get<string>('IMAGE')
        const source = this.config.get<string>('SOURCE')
        const serveroot1 = this.config.get<string>('SERVEROOT1')
        const serveroot2 = this.config.get<string>('SERVEROOT2')        
        return [{
            rootPath: join(__dirname, '..', path1,path2,image),
            serveRoot: serveroot1,
        },{
            rootPath: join(__dirname, '..', path1,path2,source),
            serveRoot: serveroot2,
        }]
    }

  
}
