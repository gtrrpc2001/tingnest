import { Injectable } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";

@Injectable()
export class ScheduleService {
  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,    
  ) {}

  
}