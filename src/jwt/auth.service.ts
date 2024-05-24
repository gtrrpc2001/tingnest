import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/service/user.service';
import { UserDTO } from 'src/dto/user.dto';
import { pwBcrypt } from 'src/clsfunc/pwAES';
import { Payload } from 'src/interface/payload';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userSerivce: UserService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    body: UserDTO,
  ): Promise<{ accessToken: string } | undefined> {
    try {
      let userFind = await this.userSerivce.findByFields(body.id, body.phone);
      const validatePassword = pwBcrypt.validatePwd(body.pwd, userFind.pwd);

      if (!userFind || !validatePassword) {
        throw new UnauthorizedException('Login Failed!');
      }

      const payload: Payload = { id: userFind.id, phone: userFind.phone };
      return {
        accessToken: this.jwtService.sign(payload),
      };
    } catch (E) {
      console.log(E);
    }
  }

  async tokenValidateUser(payload: Payload): Promise<any> {
    try {
      const result = await this.userSerivce.findByFields(
        payload.id,
        payload.phone,
      );
      return result;
    } catch (E) {
      console.log(E);
    }
  }

  getCookieWithJwtToken() {}
}
