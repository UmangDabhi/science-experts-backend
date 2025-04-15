import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from 'src/material/entities/material.entity';
import { MaterialPurchase } from './entities/material_purchase.entity';
import { MaterialPurchaseController } from './material_purchase.controller';
import { MaterialPurchaseService } from './material_purchase.service';

@Module({
  imports: [TypeOrmModule.forFeature([MaterialPurchase, Material])],
  controllers: [MaterialPurchaseController],
  providers: [MaterialPurchaseService],
  exports: [MaterialPurchaseService],
})
export class MaterialPurchaseModule { }
