import { Controller, Get,Post,Body,Query, Res} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserDTO } from '../dto/user.dto';
import { UserService } from 'src/service/user.service';
import { Response } from 'express';

@Controller('ting')
@ApiTags('ting')
export class UserController {
  constructor(private readonly userService: UserService) {}  

  @Post("/api_getdata")
 async postAll(    
   @Body() body: UserDTO): Promise<any> {        
    return await this.userService.gubunKind(body);
  }
  
  @Get('/mapProfiles')
  async sendImageFile(
    @Res() res: Response,
    @Query('id') id:string) {
    await this.userService.sendProfiles(res,id);    
  }
     
}