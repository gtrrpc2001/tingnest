import { Module} from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/service/user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessStrategy } from './jwtAccessStrategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports:[
        JwtModule.registerAsync({
            imports:[ConfigModule],
            inject:[ConfigService],
            useFactory: async (configService:ConfigService) => (
                {
                    global:true,
                    secret:configService.get<string>('JWT_SECRET'),
                    signOptions:{expiresIn:configService.get<string>('JWT_EXPIRATION_TIME')}
                }
            )
        }),
        PassportModule.register({defaultStrategy:'jwt'})
    ],
    controllers:[AuthController],
    providers:[AuthService,UserService,JwtModule,JwtAccessStrategy]
})
export class AuthModule {}