import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { Blog } from './entities/blog.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Standard } from 'src/standard/entities/standard.entity';
import { Language } from 'src/language/entities/language.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, Category, Standard, Language])],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule { }
