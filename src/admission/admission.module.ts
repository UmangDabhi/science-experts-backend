import { Module } from '@nestjs/common';
import { AdmissionService } from './admission.service';
import { AdmissionController } from './admission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admission } from './entities/admission.entity';
import { College } from 'src/college/entities/college.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admission, College])],
  controllers: [AdmissionController],
  providers: [AdmissionService],
})
export class AdmissionModule { }
