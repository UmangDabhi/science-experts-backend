import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateStandardDto } from './dto/create-standard.dto';
import { UpdateStandardDto } from './dto/update-standard.dto';
import { Standard } from './entities/standard.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ERRORS } from 'src/Helper/message/error.message';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
import { pagniateRecords } from 'src/Helper/pagination/pagination.util';

@Injectable()
export class StandardService {
  constructor(
    @InjectRepository(Standard)
    private readonly standardRepository: Repository<Standard>,
  ) {}
  async create(createStandardDto: CreateStandardDto) {
    try {
      const newStandard = this.standardRepository.create(createStandardDto);
      return await this.standardRepository.save(newStandard);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(ERRORS.ERROR_STANDARD_ALREADY_EXISTS);
      }
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_STANDARD);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const searchableFields: (keyof Standard)[] = ['standard'];
      const result = await pagniateRecords(
        this.standardRepository,
        paginationDto,
        searchableFields,
      );
      return result;
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_STANDARDS);
    }
  }

  async findOne(id: string) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }
      const standard = await this.standardRepository.findOne({
        where: { id: id },
      });
      if (!standard) {
        throw new NotFoundException(ERRORS.ERROR_STANDARD_NOT_FOUND);
      }
      return standard;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_STANDARD);
    }
  }

  async update(id: string, updateStandardDto: UpdateStandardDto) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }
      const standard = await this.standardRepository.findOne({
        where: { id: id },
      });
      if (!standard) {
        throw new NotFoundException(ERRORS.ERROR_STANDARD_NOT_FOUND);
      }
      await this.standardRepository.update(id, updateStandardDto);
      return;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORS.ERROR_UPDATING_STANDARD);
    }
  }

  async remove(id: string) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }
      const standard = await this.standardRepository.findOne({
        where: { id: id },
      });
      if (!standard) {
        throw new NotFoundException(ERRORS.ERROR_STANDARD_NOT_FOUND);
      }
      await this.standardRepository.delete(standard.id);
      return;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      if (error.code == '23503') {
        throw new ConflictException(ERRORS.ERROR_STANDARD_ASSIGNED_ALREADY);
      }
      throw new InternalServerErrorException(ERRORS.ERROR_DELETING_STANDARD);
    }
  }
}
