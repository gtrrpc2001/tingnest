import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { Payload } from 'src/interface/payload';

export class JwtRefreshStretagy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.refresh;
        },
      ]),
      ignoreExpiration: true,
      passReqToCallback: true,
      algorithms: ['HS256'],
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  validate(req: Request, payload: Payload) {
    const refreshToken = req.cookies['refreshToken'];
    console.log(`refresh : ${payload}`);
    // return this.
  }
}
