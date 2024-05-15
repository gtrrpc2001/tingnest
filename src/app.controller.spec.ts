import { Test, TestingModule } from '@nestjs/testing';
import { ecg_raw_monthlyController } from './controller/ecg_raw_monthly.controller';
import { ecg_raw_monthlyService } from './service/ecg_raw_monthly.service';

describe('ecg_raw_monthlyController', () => {
  let appController: ecg_raw_monthlyController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ecg_raw_monthlyController],
      providers: [ecg_raw_monthlyService],
    }).compile();

    appController = app.get<ecg_raw_monthlyController>(ecg_raw_monthlyController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect('').toBe('Hello World!');
    });
  });
});
