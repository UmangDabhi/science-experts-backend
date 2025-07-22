import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorReq } from './entities/tutor_req.entity';
import { TutorReqController } from './tutor_req.controller';
import { TutorReqService } from './tutor_req.service';

@Module({
  imports: [TypeOrmModule.forFeature([TutorReq])],
  controllers: [TutorReqController],
  providers: [TutorReqService],
})
export class TutorReqModule {}
