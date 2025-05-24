import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Standard } from 'src/standard/entities/standard.entity';
import { Language } from 'src/language/entities/language.entity';
import { ERRORS } from 'src/Helper/message/error.message';
import { User } from 'src/user/entities/user.entity';
import { FilterDto } from 'src/Helper/dto/filter.dto';
import { Role } from 'src/Helper/constants';
import { BookPurchase } from './entities/book_purchase.entity';
import { plainToInstance } from 'class-transformer';
import { BookPublicDto } from './dto/book-public.dto';
import { pagniateRecords } from 'src/Helper/pagination/pagination.util';
import { PaginatedResult } from 'src/Helper/pagination/paginated-result.interface';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
    @InjectRepository(BookPurchase)
    private readonly bookPurchaseRepository: Repository<BookPurchase>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Standard)
    private readonly standardRepository: Repository<Standard>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) { }
  async create(currUser: User, createBookDto: CreateBookDto) {
    try {
      const categoryEntities = createBookDto.categories
        ? await this.categoryRepository.findBy({
          id: In(createBookDto.categories),
        })
        : [];
      const standardEntities = createBookDto.standards
        ? await this.standardRepository.findBy({
          id: In(createBookDto.standards),
        })
        : [];
      const newBook = this.bookRepository.create({
        ...createBookDto,
        language: createBookDto.language ? { id: createBookDto.language } : undefined, // Only add course if provided
        categories: categoryEntities,
        standards: standardEntities,
        tutor: { id: currUser.id },
      });

      return await this.bookRepository.save(newBook);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_BOOK);
    }
  }
  async manageAllBook(currUser: User, filterDto: FilterDto) {
    try {
      const searchableFields: (keyof Book)[] = ['title'];
      const queryOptions: any = {};
      const orderBy: any = {
        field: 'created_at',
        direction: 'DESC',
      };

      if (currUser && currUser.role == Role.TUTOR) {
        queryOptions.tutor = { id: currUser.id };
      }

      if (filterDto?.category) {
        queryOptions.categories = { id: filterDto.category };
      }

      if (filterDto?.standard) {
        queryOptions.standards = { id: filterDto.standard };
      }

      const sortOptions = {
        "Most Populer": { field: "created_at", direction: 'DESC', },
        "Price:Low to High": { field: "amount", direction: "ASC" },
        "Price:High to Low": { field: "amount", direction: "DESC" },
      };

      const selectedSort = sortOptions[filterDto?.sortby] || {};
      orderBy.field = selectedSort.field || "";
      orderBy.direction = selectedSort.direction;


      const books = await pagniateRecords(
        this.bookRepository,
        filterDto,
        searchableFields,
        queryOptions,
        [],
        orderBy,
      );
      const result = books;


      if (!currUser || currUser.role === Role.STUDENT) {
        const studentResult: PaginatedResult<BookPublicDto> = {
          ...books,
          data: books.data.map(book =>
            plainToInstance(BookPublicDto, book, {
              excludeExtraneousValues: true,
            }),
          ),
        };
        return studentResult;
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_BOOKS);
    }
  }

  async findAll(currUser: User, filterDto: FilterDto) {
    try {
      const searchableFields: (keyof Book)[] = ['title'];
      const queryOptions: any = {};
      const orderBy: any = {
        field: 'created_at',
        direction: 'DESC',
      };

      if (currUser && currUser.role == Role.TUTOR) {
        queryOptions.tutor = { id: currUser.id };
      }

      if (filterDto?.category) {
        queryOptions.categories = { id: filterDto.category };
      }

      if (filterDto?.standard) {
        queryOptions.standards = { id: filterDto.standard };
      }

      const sortOptions = {
        "Most Populer": { field: "created_at", direction: 'DESC', },
        "Price:Low to High": { field: "amount", direction: "ASC" },
        "Price:High to Low": { field: "amount", direction: "DESC" },
      };

      const selectedSort = sortOptions[filterDto?.sortby] || {};
      orderBy.field = selectedSort.field || "";
      orderBy.direction = selectedSort.direction;


      const books = await pagniateRecords(
        this.bookRepository,
        filterDto,
        searchableFields,
        queryOptions,
        [],
        orderBy,
      );
      const result = books;


      if (!currUser || currUser.role === Role.STUDENT) {
        const studentResult: PaginatedResult<BookPublicDto> = {
          ...books,
          data: books.data.map(book =>
            plainToInstance(BookPublicDto, book, {
              excludeExtraneousValues: true,
            }),
          ),
        };
        return studentResult;
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_BOOKS);
    }
  }


  async findOne(currUser: User, id: string) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);

      const book = await this.bookRepository.findOne({
        where: { id: id },
        relations: [
          'tutor',
          'categories',
          'standards',
          'language',
        ],
      });
      if (!book)
        throw new NotFoundException(ERRORS.ERROR_BOOK_NOT_FOUND);
      if (currUser) {
        const book_purchase = await this.bookPurchaseRepository.findOne({
          where: {
            book: {
              id: book.id,
            },
            student: {
              id: currUser?.id
            }
          }
        })
        if (book_purchase)
          book["is_purchased"] = true;
        else
          book["is_purchased"] = false;
      }
      if (!currUser || currUser.role == Role.STUDENT) {
        plainToInstance(BookPublicDto, book, {
          excludeExtraneousValues: true,
        })
      }
      return book;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_BOOK);
    }
  }

  async update(
    currUser: User,
    id: string,
    updateBookDto: UpdateBookDto,
  ) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      const whereCondition = currUser.role == Role.ADMIN ? { id: id } : { id: id, tutor: { id: currUser.id } }
      const book = await this.bookRepository.findOne({
        where: whereCondition,
      });

      if (!book)
        throw new NotFoundException(ERRORS.ERROR_BOOK_NOT_FOUND);
      const categoryEntities = updateBookDto.categories
        ? await this.categoryRepository.findBy({
          id: In(updateBookDto.categories),
        })
        : [];
      const standardEntities = updateBookDto.standards
        ? await this.standardRepository.findBy({
          id: In(updateBookDto.standards),
        })
        : [];
      const langaugeEntity = await this.languageRepository.findOne({
        where: { id: updateBookDto.language }
      })
      const updateData: any = { ...updateBookDto };
      updateData.tutor = { id: currUser.id };

      Object.assign(book, {
        ...updateBookDto,
        tutor: { id: currUser.id },
        categories: categoryEntities,
        standards: standardEntities,
        language: langaugeEntity,
      });

      await this.bookRepository.save(book);
      return;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof NotFoundException
      )
        throw error;
      console.log(error)
      throw new InternalServerErrorException(ERRORS.ERROR_UPDATING_BOOK);
    }
  }

  async remove(currUser: User, id: string) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }
      const book = await this.bookRepository.findOne({
        where: { id: id, tutor: { id: currUser.id } },
      });
      if (!book) {
        throw new NotFoundException(ERRORS.ERROR_BOOK_NOT_FOUND);
      }
      await this.bookRepository.softDelete(id);
      return;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORS.ERROR_DELETING_BOOK);
    }
  }
}
