import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Category } from 'src/category/entities/category.entity';
import { Language } from 'src/language/entities/language.entity';
import { Standard } from 'src/standard/entities/standard.entity';
import { BookPurchase } from './entities/book_purchase.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, BookPurchase, Category, Language, Standard])],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule { }
