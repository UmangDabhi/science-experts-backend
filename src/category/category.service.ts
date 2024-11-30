import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { ERRORS } from 'src/Helper/message/error.message';
import { pagniateRecords } from 'src/Helper/pagination/pagination.util';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) { }
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const newCategory = this.categoryRepository.create(createCategoryDto,);
      return await this.categoryRepository.save(newCategory);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(ERRORS.ERROR_CATEGORY_ALREADY_EXISTS);
      }
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_COURSE);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const searchableFields: (keyof Category)[] = ['category'];
      const result = await pagniateRecords(
        this.categoryRepository,
        paginationDto,
        searchableFields,
      );

      return result;
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_CATEGORIES);
    }
  }
  async findOne(id: string) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }
      const category = await this.categoryRepository.findOne({ where: { id: id } });
      if (!category) {
        throw new NotFoundException(ERRORS.ERROR_CATEGORY_NOT_FOUND);
      }
      return category;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_CATEGORY);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }
      const category = await this.categoryRepository.findOne({ where: { id: id } });
      if (!category) {
        throw new NotFoundException(ERRORS.ERROR_CATEGORY_NOT_FOUND);
      }
      await this.categoryRepository.update(id, updateCategoryDto);
      return;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORS.ERROR_UPDATING_CATEGORY);
    }
  }

  async remove(id: string) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }
      const category = await this.categoryRepository.findOne({ where: { id: id } });
      if (!category) {
        throw new NotFoundException(ERRORS.ERROR_CATEGORY_NOT_FOUND);
      }
      await this.categoryRepository.delete(category.id);
      return;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORS.ERROR_DELETING_CATEGORY);
    }
  }
}
