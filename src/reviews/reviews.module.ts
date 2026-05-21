import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { User } from 'src/user/entities/user.entity';
import { Course } from 'src/course/entities/course.entity';
import { ModuleEntity } from 'src/module/entities/module.entity';
import { Material } from 'src/material/entities/material.entity';
import { Book } from 'src/books/entities/book.entity';
import { Paper } from 'src/papers/entities/paper.entity';
import { Blog } from 'src/blogs/entities/blog.entity';
import { Enrollment } from 'src/enrollment/entities/enrollment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, User, Course, ModuleEntity, Material, Book, Paper, Blog, Enrollment])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
