import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Category } from 'src/category/entities/category.entity';
import { Standard } from 'src/standard/entities/standard.entity';
import { Language } from 'src/language/entities/language.entity';
import { Material } from 'src/material/entities/material.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { ModuleEntity } from 'src/module/entities/module.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      Material,
      Category,
      Standard,
      Language,
      Enrollment,
      ModuleEntity,
    ]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
