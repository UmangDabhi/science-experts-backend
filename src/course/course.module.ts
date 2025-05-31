import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Category } from 'src/category/entities/category.entity';
import { Standard } from 'src/standard/entities/standard.entity';
import { Language } from 'src/language/entities/language.entity';
import { Material } from 'src/material/entities/material.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Material, Category, Standard, Language])],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule { }
