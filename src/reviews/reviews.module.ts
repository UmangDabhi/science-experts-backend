import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { User } from 'src/user/entities/user.entity';
import { Course } from 'src/course/entities/course.entity';
import { ModuleEntity } from 'src/module/entities/module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, User, Course, ModuleEntity])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule { }
