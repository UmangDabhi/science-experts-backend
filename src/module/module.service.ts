import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ERRORS } from 'src/Helper/message/error.message';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuleEntity } from './entities/module.entity';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
import { pagniateRecords } from 'src/Helper/pagination/pagination.util';
import { Course } from 'src/course/entities/course.entity';
import { UpdateModuleOrderDto } from './dto/update-module-order.dto';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(ModuleEntity)
    private readonly moduleRepository: Repository<ModuleEntity>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly dataSource: DataSource
  ) { }
  async create(createModuleDto: CreateModuleDto) {
    try {
      const maxOrderModule = await this.moduleRepository.findOne({
        where: {
          course: { id: createModuleDto.course }
        },
        order: {
          order: "DESC"
        }
      })
      const order = maxOrderModule ? maxOrderModule.order + 1 : 1
      const newModule = this.moduleRepository.create({
        ...createModuleDto,
        order: order,
        course: { id: createModuleDto.course },
      });
      return await this.moduleRepository.save(newModule);
    } catch (error) {
      console.log(error);
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
            id: courseId,
          },
        },
        order: { order: "ASC" }
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_MODULES);
    }
  }

  async findOne(id: string) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);

      const module = await this.moduleRepository.findOne({ where: { id }, relations: ["course"] });
      if (!module) throw new NotFoundException(ERRORS.ERROR_MODULE_NOT_FOUND);

      return module;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_MODULE);
    }
  }

  async update(id: string, updateModuleDto: UpdateModuleDto) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);

      const module = await this.moduleRepository.findOne({
        where: { id },
        relations: ['course'], // include relations if needed
      });

      if (!module) throw new NotFoundException(ERRORS.ERROR_MODULE_NOT_FOUND);

      // If course ID is provided, fetch the course entity
      let courseEntity = null;
      if (updateModuleDto.course) {
        courseEntity = await this.courseRepository.findOne({
          where: { id: updateModuleDto.course },
        });

        if (!courseEntity) throw new NotFoundException("Course not found.");
      }

      Object.assign(module, {
        ...updateModuleDto,
        ...(courseEntity && { course: courseEntity }), // only assign if found
      });

      await this.moduleRepository.save(module);

      return;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;

      console.log(error);
      throw new InternalServerErrorException(ERRORS.ERROR_UPDATING_MODULE);
    }
  }
  async updateOrder(updateModuleOrderDto: UpdateModuleOrderDto) {
    const { modules } = updateModuleOrderDto;
    const orders = modules.map(d => d.order);
    const hasDuplicates = new Set(orders).size !== orders.length;
    if (hasDuplicates) {
      throw new BadRequestException('Duplicate order values are not allowed.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const { id, order } of modules) {
        await queryRunner.manager.update(ModuleEntity, { id }, { order });
      }
      await queryRunner.commitTransaction();
      return { message: 'Module orders updated successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_MODULE);
    } finally {
      await queryRunner.release();
    }
  }


  async remove(id: string) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);

      const module = await this.moduleRepository.findOne({ where: { id } });
      if (!module) throw new NotFoundException(ERRORS.ERROR_MODULE_NOT_FOUND);

      await this.moduleRepository.softDelete(id);
      return;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;

      throw new InternalServerErrorException(ERRORS.ERROR_DELETING_MODULE);
    }
  }
}
