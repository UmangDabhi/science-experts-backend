import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ModuleEntity } from './entities/module.entity';
import { Course } from 'src/course/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleEntity, Course])],
  controllers: [ModuleController],
  providers: [ModuleService],
})
export class ModuleModule { }
