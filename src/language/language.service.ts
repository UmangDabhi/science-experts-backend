import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { Language } from './entities/language.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ERRORS } from 'src/Helper/message/error.message';
import { pagniateRecords } from 'src/Helper/pagination/pagination.util';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) { }
  async create(createLanguageDto: CreateLanguageDto) {
    try {
      const newCategory = this.languageRepository.create(createLanguageDto);
      return await this.languageRepository.save(newCategory);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(ERRORS.ERROR_LANGUAGE_ALREADY_EXISTS);
      }
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_LANGUAGE);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const searchableFields: (keyof Language)[] = ['language'];
      const result = await pagniateRecords(
        this.languageRepository,
        paginationDto,
        searchableFields,
      );

      return result;
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_LANGUAGES);
    }
  }

  async update(id: string, updateLanguageDto: UpdateLanguageDto) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }
      const category = await this.languageRepository.findOne({
        where: { id: id },
      });
      if (!category) {
        throw new NotFoundException(ERRORS.ERROR_CATEGORY_NOT_FOUND);
      }
      await this.languageRepository.update(id, updateLanguageDto);
      return;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORS.ERROR_UPDATING_CATEGORY);
    }
  }

 async  remove(id: string) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }
      const category = await this.languageRepository.findOne({
        where: { id: id },
      });
      if (!category) {
        throw new NotFoundException(ERRORS.ERROR_CATEGORY_NOT_FOUND);
      }
      await this.languageRepository.delete(category.id);
      return;
    } catch (error) {
      console.log(error);
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      if (error.code == '23503') {
        throw new ConflictException(ERRORS.ERROR_CATEGORY_ASSIGNED_ALREADY);
      }
      throw new InternalServerErrorException(ERRORS.ERROR_DELETING_CATEGORY);
    }

  }
}
