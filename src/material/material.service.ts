import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERRORS } from 'src/Helper/message/error.message';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
import { pagniateRecords } from 'src/Helper/pagination/pagination.util';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { Material } from './entities/material.entity';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {}
  async create(currUser: User, createMaterialDto: CreateMaterialDto) {
    try {
      const newMaterial = this.materialRepository.create({
        ...createMaterialDto,
        course: { id: createMaterialDto.course },
        tutor: { id: currUser.id },
      });
      return await this.materialRepository.save(newMaterial);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_MATERIAL);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const searchableFields: (keyof Material)[] = ['title'];
      const result = await pagniateRecords(
        this.materialRepository,
        paginationDto,
        searchableFields,
      );
      result.data.forEach((material) => {
        if (material.material_url) {
          material.material_url = `${process.env.BASE_MEDIA_URL}/${material.material_url}`;
        }
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_MATERIALS);
    }
  }

  async findOne(id: string) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);

      const material = await this.materialRepository.findOne({
        where: { id: id },
      });
      if (!material)
        throw new NotFoundException(ERRORS.ERROR_MATERIAL_NOT_FOUND);

      material.material_url = `${process.env.BASE_MEDIA_URL}/${material.material_url}`;
      return material;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_MATERIAL);
    }
  }

  async update(
    currUser: User,
    id: string,
    updateMaterialDto: UpdateMaterialDto,
  ) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);

      const material = await this.materialRepository.findOne({
        where: { id: id, tutor: { id: currUser.id } },
      });
      if (!material)
        throw new NotFoundException(ERRORS.ERROR_MATERIAL_NOT_FOUND);

      const updateData: any = { ...updateMaterialDto };
      updateData.tutor = { id: currUser.id };

      await this.materialRepository.update(id, updateData);
      return;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof NotFoundException
      )
        throw error;

      throw new InternalServerErrorException(ERRORS.ERROR_UPDATING_MATERIAL);
    }
  }

  async remove(currUser: User, id: string) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }
      const material = await this.materialRepository.findOne({
        where: { id: id, tutor: { id: currUser.id } },
      });
      if (!material) {
        throw new NotFoundException(ERRORS.ERROR_MATERIAL_NOT_FOUND);
      }
      await this.materialRepository.softDelete(id);
      return;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORS.ERROR_DELETING_MATERIAL);
    }
  }
}
