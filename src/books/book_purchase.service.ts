import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERRORS } from 'src/Helper/message/error.message';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateBookPurchaseDto } from './dto/create-book_purchase.dto';
import { Book } from './entities/book.entity';
import { BookPurchase } from './entities/book_purchase.entity';

@Injectable()
export class BookPurchaseService {
  constructor(
    @InjectRepository(BookPurchase)
    private readonly bookPurchaseRepository: Repository<BookPurchase>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>
  ) { }
  async create(currUser: User, createBookPurchaseDto: CreateBookPurchaseDto) {
    try {
      const existingBook = await this.bookRepository.findOne({
        where: { id: createBookPurchaseDto.book },
      });
      if (!existingBook) {
        throw new NotFoundException(ERRORS.ERROR_BOOK_NOT_FOUND);
      }
      const newBook = await this.bookPurchaseRepository.save({
        book: existingBook,
        student: { id: currUser.id },
      });
      return newBook;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error.code === '23505') {
        throw new ConflictException(ERRORS.ERROR_BOOK_PURCHASE_ALEARDY_EXISTS);
      }
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_BOOK_PURCHASE);
    }
  }

}
