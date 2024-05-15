import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";
import { AuthService } from "./auth.service";
import { Payload } from "src/interface/payload";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy,'access'){
    constructor(
        private authService:AuthService,
        private configService:ConfigService
    ){
        super(
            {
                //jwt토큰 분석
                jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
                ignoreExpiration:true,
                secretOrKey:configService.get<string>('JWT_SECRET')
            }
        )
    }

    async validate(payload:Payload,done: VerifiedCallback){
        const user = await this.authService.tokenValidateUser(payload);
        if(!user){
            done(new UnauthorizedException({message: 'user does not exist!'}))
        }

        done(null,user)
    }

}