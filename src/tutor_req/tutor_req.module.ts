import { Module } from '@nestjs/common';
import { TutorReqService } from './tutor_req.service';
import { TutorReqController } from './tutor_req.controller';

@Module({
  controllers: [TutorReqController],
  providers: [TutorReqService],
})
export class TutorReqModule {}
