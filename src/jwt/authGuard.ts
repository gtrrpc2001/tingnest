import { ExecutionContext, Injectable,CanActivate,UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard as NestAuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import {Request} from 'express'

@Injectable()
export class AuthGuard extends NestAuthGuard('jwt'){
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }
}