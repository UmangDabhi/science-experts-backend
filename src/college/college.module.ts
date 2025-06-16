import { Module } from '@nestjs/common';
import { CollegeService } from './college.service';
import { CollegeController } from './college.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { College } from './entities/college.entity';
import { CollegeCourse } from 'src/college-courses/entities/college-course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([College,CollegeCourse])],
  controllers: [CollegeController],
  providers: [CollegeService],
})
export class CollegeModule { }
