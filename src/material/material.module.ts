import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from './entities/material.entity';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';
import { Category } from 'src/category/entities/category.entity';
import { Language } from 'src/language/entities/language.entity';
import { Standard } from 'src/standard/entities/standard.entity';
import { MaterialPurchase } from 'src/material/entities/material_purchase.entity';
import { MaterialPurchaseService } from './material_purchase.service';

@Module({
  imports: [TypeOrmModule.forFeature([Material, MaterialPurchase, Category, Language, Standard, MaterialPurchase])],
  controllers: [MaterialController],
  providers: [MaterialService, MaterialPurchaseService],
  exports: [MaterialPurchaseService],

})
export class MaterialModule { }
