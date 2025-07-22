import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTutorReqDto } from './dto/create-tutor_req.dto';
import { UpdateTutorReqDto } from './dto/update-tutor_req.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TutorReq } from './entities/tutor_req.entity';
import { ERRORS } from 'src/Helper/message/error.message';
import { FilterDto } from 'src/Helper/dto/filter.dto';
import { pagniateRecords } from 'src/Helper/pagination/pagination.util';

@Injectable()
export class TutorReqService {
  constructor(
    @InjectRepository(TutorReq)
    private readonly tutorReqRepository: Repository<TutorReq>,
  ) {}
  async create(createTutorReqDto: CreateTutorReqDto) {
    try {
      const newReq = this.tutorReqRepository.create({
        ...createTutorReqDto,
      });
      return await this.tutorReqRepository.save(newReq);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_TUTOR_REQ);
    }
  }

  async findAll(filterDto: FilterDto) {
    try {
      const searchableFields: (keyof TutorReq)[] = [
        'name',
        'email',
        'phone_no',
      ];
      const queryOptions: any = {};
      const orderBy: any = {
        field: 'created_at',
        direction: 'DESC',
      };

      const sortOptions = {
        'Most Populer': { field: 'created_at', direction: 'DESC' },
        'Price:Low to High': { field: 'amount', direction: 'ASC' },
        'Price:High to Low': { field: 'amount', direction: 'DESC' },
      };

      const selectedSort = sortOptions[filterDto?.sortby] || {};
      if (selectedSort) {
        orderBy.field = selectedSort.field || '';
        orderBy.direction = selectedSort.direction;
      }

      const tutorReqs = await pagniateRecords(
        this.tutorReqRepository,
        filterDto,
        searchableFields,
        queryOptions,
        [],
        orderBy,
      );
      return tutorReqs;
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_TUTOR_REQS);
    }
  }

  async findOne(id: string) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);

      const tutorReq = await this.tutorReqRepository.findOne({
        where: { id: id },
      });

      return tutorReq;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_TUTOR_REQ);
    }
  }

  async update(id: string, updateTutorReqDto: UpdateTutorReqDto) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);

      const tutorReq = await this.tutorReqRepository.findOne({
        where: { id: id },
      });

      if (!tutorReq)
        throw new NotFoundException(ERRORS.ERROR_TUTOR_REQ_NOT_FOUND);

      Object.assign(tutorReq, updateTutorReqDto);

      await this.tutorReqRepository.save(tutorReq);
      return;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof NotFoundException
      )
        throw error;
      console.log(error);
      throw new InternalServerErrorException(ERRORS.ERROR_UPDATING_TUTOR_REQ);
    }
  }

  async remove(id: string) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }
      const tutorReq = await this.tutorReqRepository.findOne({
        where: { id: id },
      });
      if (!tutorReq) {
        throw new NotFoundException(ERRORS.ERROR_TUTOR_REQ_NOT_FOUND);
      }
      await this.tutorReqRepository.softDelete(id);
      return;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORS.ERROR_DELETING_TUTOR_REQ);
    }
  }
}
