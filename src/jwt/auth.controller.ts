import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Res,
  Req,
  HttpCode,
  UseGuards,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDTO } from 'src/dto/user.dto';
import { AuthService } from 'src/jwt/auth.service';
import { AuthGuard } from './authGuard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/sign-in')
  async signIn(
    @Body() body: UserDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const jwt = await this.authService.validateUser(body);
    return jwt.accessToken;
  }

  @Get('/profile')
  @UseGuards(AuthGuard)
  getProfile(@Request() req): any {
    return req.user;
  }
}
