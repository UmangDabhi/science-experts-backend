import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ERRORS } from 'src/Helper/message/error.message';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuleEntity } from './entities/module.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
import { pagniateRecords } from 'src/Helper/pagination/pagination.util';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(ModuleEntity)
    private readonly moduleRepository: Repository<ModuleEntity>
  ) { }c
  async create(createModuleDto: CreateModuleDto) {
    try {
      const newModule = this.moduleRepository.create({
        ...createModuleDto,
        course: { id: createModuleDto.course },
      });
      return await this.moduleRepository.save(newModule);
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_MODULE);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const searchableFields: (keyof ModuleEntity)[] = ['title'];
      const result = await pagniateRecords(
        this.moduleRepository,
        paginationDto,
        searchableFields,
      );
      return result;
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_MODULES);
    }
  }
  async findAllByCourseId(courseId: string) {
    try {
      const result = await this.moduleRepository.find({
          where: {
            course: {
              id: courseId
            }
          }
        });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_MODULES);
    }
  }

  async findOne(id: string) {
    try {
      if (!id)
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED)

      const module = await this.moduleRepository.findOne({ where: { id } })
      if (!module)
        throw new NotFoundException(ERRORS.ERROR_MODULE_NOT_FOUND);

      return module;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException)
        throw error;
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_MODULE)
    }
  }

  async update(id: string, updateModuleDto: UpdateModuleDto) {
    try {
      if (!id)
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED)
      const module = await this.moduleRepository.findOne({ where: { id } });
      if (!module)
        throw new NotFoundException(ERRORS.ERROR_MODULE_NOT_FOUND)
      const updateData: any = { ...updateModuleDto };
      if (updateModuleDto.course)
        updateData.course = { id: updateModuleDto.course }
      else delete updateData.course;
      await this.moduleRepository.update(id, updateData);
      return;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException)
        throw error;
      throw new InternalServerErrorException(ERRORS.ERROR_UPDATING_MODULE)
    }
  }

  async remove(id: string) {
    try {
      if (!id)
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);

      const module = await this.moduleRepository.findOne({ where: { id } })
      if (!module)
        throw new NotFoundException(ERRORS.ERROR_MODULE_NOT_FOUND);

      await this.moduleRepository.softDelete(id);
      return;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException)
        throw error;

      throw new InternalServerErrorException(ERRORS.ERROR_DELETING_MODULE);
    }
  }
}
