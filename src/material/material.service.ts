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
import { In, Repository } from 'typeorm';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { Material } from './entities/material.entity';
import { Role } from 'src/Helper/constants';
import { MaterialPublicDto } from './dto/material-public.dto';
import { plainToInstance } from 'class-transformer';
import { PaginatedResult } from 'src/Helper/pagination/paginated-result.interface';
import { Category } from 'src/category/entities/category.entity';
import { Language } from 'src/language/entities/language.entity';
import { Standard } from 'src/standard/entities/standard.entity';
import { MaterialPurchase } from 'src/material_purchase/entities/material_purchase.entity';

@Injectable()
export class MaterialService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
    @InjectRepository(MaterialPurchase)
    private readonly materialPurchaseRepository: Repository<MaterialPurchase>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Standard)
    private readonly standardRepository: Repository<Standard>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) { }
  async create(currUser: User, createMaterialDto: CreateMaterialDto) {
    try {
      const categoryEntities = createMaterialDto.categories
        ? await this.categoryRepository.findBy({
          id: In(createMaterialDto.categories),
        })
        : [];
      const standardEntities = createMaterialDto.standards
        ? await this.standardRepository.findBy({
          id: In(createMaterialDto.standards),
        })
        : [];
      const newMaterial = this.materialRepository.create({
        ...createMaterialDto,
        course: createMaterialDto.course ? { id: createMaterialDto.course } : undefined, // Only add course if provided
        language: createMaterialDto.language ? { id: createMaterialDto.language } : undefined, // Only add course if provided
        categories: categoryEntities,
        standards: standardEntities,
        tutor: { id: currUser.id },
      });

      return await this.materialRepository.save(newMaterial);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_MATERIAL);
    }
  }

  async findAll(currUser: User, paginationDto: PaginationDto) {
    try {
      const searchableFields: (keyof Material)[] = ['title'];
      const queryOptions: any = {};
      if (currUser && currUser.role == Role.TUTOR) {
        queryOptions.tutor = { id: currUser.id };
      }
      const materials = await pagniateRecords(
        this.materialRepository,
        paginationDto,
        searchableFields,
        queryOptions,
      );
      const result = materials;
      if (!currUser || currUser.role === Role.STUDENT) {
        const studentResult: PaginatedResult<MaterialPublicDto> = {
          ...materials,
          data: materials.data.map(material =>
            plainToInstance(MaterialPublicDto, material, {
              excludeExtraneousValues: true,
            }),
          ),
        };
        return studentResult;
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_MATERIALS);
    }
  }
  async findAllByCourseId(courseId: string) {
    try {
      const result = await this.materialRepository.find({
        where: {
          course: {
            id: courseId,
          },
        },
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_MODULES);
    }
  }

  async findOne(currUser: User, id: string) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);

      const material = await this.materialRepository.findOne({
        where: { id: id },
        relations: [
          'tutor',
          'categories',
          'standards',
          'language',
          'material_purchases',
          'material_purchases.student',
        ],
      });
      if (!material)
        throw new NotFoundException(ERRORS.ERROR_MATERIAL_NOT_FOUND);
      if (currUser) {
        const material_purchase = await this.materialPurchaseRepository.findOne({
          where: {
            material: {
              id: material.id,
            },
            student: {
              id: currUser?.id
            }
          }
        })
        if (material_purchase)
          material["is_purchased"] = true;
        else
          material["is_purchased"] = false;
      }
      if (!currUser || currUser.role == Role.STUDENT) {
        plainToInstance(MaterialPublicDto, material, {
          excludeExtraneousValues: true,
        })
      }
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
      const whereCondition = currUser.role == Role.ADMIN ? { id: id } : { id: id, tutor: { id: currUser.id } }
      const material = await this.materialRepository.findOne({
        where: whereCondition,
      });

      if (!material)
        throw new NotFoundException(ERRORS.ERROR_MATERIAL_NOT_FOUND);
      const categoryEntities = updateMaterialDto.categories
        ? await this.categoryRepository.findBy({
          id: In(updateMaterialDto.categories),
        })
        : [];
      const standardEntities = updateMaterialDto.standards
        ? await this.standardRepository.findBy({
          id: In(updateMaterialDto.standards),
        })
        : [];
      const langaugeEntity = await this.languageRepository.findOne({
        where: { id: updateMaterialDto.language }
      })
      const updateData: any = { ...updateMaterialDto };
      updateData.tutor = { id: currUser.id };

      Object.assign(material, {
        ...updateMaterialDto,
        tutor: { id: currUser.id },
        categories: categoryEntities,
        standards: standardEntities,
        language: langaugeEntity,
      });

      await this.materialRepository.save(material);
      return;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof NotFoundException
      )
        throw error;
      console.log(error)
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
