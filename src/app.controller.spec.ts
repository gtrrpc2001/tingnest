import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';

describe('ecg_raw_monthlyController', () => {
  let appController: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    appController = app.get<UserController>(UserController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect('').toBe('Hello World!');
    });
  });
});
