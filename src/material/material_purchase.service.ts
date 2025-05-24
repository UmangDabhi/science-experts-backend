import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERRORS } from 'src/Helper/message/error.message';
import { Material } from 'src/material/entities/material.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateMaterialPurchaseDto } from './dto/create-material_purchase.dto';
import { MaterialPurchase } from './entities/material_purchase.entity';

@Injectable()
export class MaterialPurchaseService {
  constructor(
    @InjectRepository(MaterialPurchase)
    private readonly materialPurchaseRepository: Repository<MaterialPurchase>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>
  ) { }
  async create(currUser: User, createMaterialPurchaseDto: CreateMaterialPurchaseDto) {
    try {
      const existingMaterial = await this.materialRepository.findOne({
        where: { id: createMaterialPurchaseDto.material },
      });
      if (!existingMaterial) {
        throw new NotFoundException(ERRORS.ERROR_MATERIAL_NOT_FOUND);
      }
      const newEnrollment = await this.materialPurchaseRepository.save({
        material: existingMaterial,
        student: { id: currUser.id },
      });
      return newEnrollment;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error.code === '23505') {
        throw new ConflictException(ERRORS.ERROR_MATERIAL_PURCHASE_ALEARDY_EXISTS);
      }
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_MATERIAL_PURCHASE);
    }
  }

}
