import { PartialType } from '@nestjs/mapped-types';
import { CreateMaterialPurchaseDto } from './create-material_purchase.dto';

export class UpdateMaterialPurchaseDto extends PartialType(CreateMaterialPurchaseDto) {}
