import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateAdmissionDto } from './dto/update-admission.dto';
import { Admission, AdmissionType } from './entities/admission.entity';
import { CreateAdmissionDto } from './dto/create-admission.dto';
import { ERRORS } from 'src/Helper/message/error.message';
import { FilterDto } from 'src/Helper/dto/filter.dto';
import { pagniateRecords } from 'src/Helper/pagination/pagination.util';
import { College } from 'src/college/entities/college.entity';
import { RemarkDto } from './dto/remark.dto';

@Injectable()
export class AdmissionService {
  constructor(
    @InjectRepository(Admission)
    private readonly admissionRepository: Repository<Admission>,
    @InjectRepository(College)
    private readonly collegeRepository: Repository<College>,
  ) { }

  async create(createAdmissionDto: CreateAdmissionDto) {
    const {
      college_id,
      type,
      nios_class_type,
      mbbs_location,
      ...rest
    } = createAdmissionDto;

    try {
      const newAdmission = this.admissionRepository.create({
        ...rest,
        type,
        nios_class_type: type === AdmissionType.NIOS ? nios_class_type : null,
        mbbs_location: type === AdmissionType.MBBS ? mbbs_location : null,
      });

      if (type === AdmissionType.COLLEGE && college_id) {
        const college = await this.collegeRepository.findOne({ where: { id: college_id } });
        if (!college) {
          throw new BadRequestException('Invalid college ID');
        }
        newAdmission.college = college;
      }

      return await this.admissionRepository.save(newAdmission);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_ADMISSION);
    }
  }



  async findAll(filterDto: FilterDto) {
    try {
      const searchableFields: (keyof Admission)[] = ['first_name', 'last_name'];
      const queryOptions: any = {};

      const result = await pagniateRecords(
        this.admissionRepository,
        filterDto,
        searchableFields,
        queryOptions,
      );

      return result;
    } catch (error) {
      console.log(error)

      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_ADMISSIONS);
    }
  }

  async findOne(id: string) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);

      const admission = await this.admissionRepository.findOne({
        where: { id: id },
        relations: ['college']

      });
      if (!admission) throw new NotFoundException(ERRORS.ERROR_ADMISSION_NOT_FOUND);
      return admission
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      console.log(error)
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_ADMISSION);
    }
  }


  async update(id: string, updateAdmissionDto: UpdateAdmissionDto) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      const admission = await this.admissionRepository.findOne({
        where: { id: id },
      });
      if (!admission) throw new NotFoundException(ERRORS.ERROR_ADMISSION_NOT_FOUND);

      Object.assign(admission, {
        ...updateAdmissionDto,
      });

      await this.admissionRepository.save(admission);
      return;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof NotFoundException
      )
        throw error;
      console.log(error)
      throw new InternalServerErrorException(ERRORS.ERROR_UPDATING_ADMISSION);
    }
  }
  async appendRemark(id: string, remarkDto: RemarkDto) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      const admission = await this.admissionRepository.findOne({
        where: { id: id },
      });
      if (!admission) throw new NotFoundException(ERRORS.ERROR_ADMISSION_NOT_FOUND);

      admission.remarks = [
        ...(admission.remarks || []),
        {
          remark: remarkDto.remark,
          time: new Date().toISOString(),
        },
      ];
      await this.admissionRepository.save(admission);
      return;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof NotFoundException
      )
        throw error;
      console.log(error)
      throw new InternalServerErrorException(ERRORS.ERROR_UPDATING_ADMISSION);
    }
  }


  async remove(id: string) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }
      const admission = await this.admissionRepository.findOne({
        where: { id: id, },
      });
      if (!admission) {
        throw new NotFoundException(ERRORS.ERROR_ADMISSION_NOT_FOUND);
      }
      await this.admissionRepository.softDelete(id);
      return;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORS.ERROR_DELETING_ADMISSION);
    }
  }
}
