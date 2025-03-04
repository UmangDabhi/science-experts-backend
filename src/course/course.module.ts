import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Category } from 'src/category/entities/category.entity';
import { Standard } from 'src/standard/entities/standard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Category, Standard])],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule { }
