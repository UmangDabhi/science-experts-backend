import { Module } from '@nestjs/common';
import { CollegeCoursesService } from './college-courses.service';
import { CollegeCoursesController } from './college-courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollegeCourse } from './entities/college-course.entity';
import { College } from 'src/college/entities/college.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CollegeCourse, College])],
  controllers: [CollegeCoursesController],
  providers: [CollegeCoursesService],
})
export class CollegeCoursesModule { }
