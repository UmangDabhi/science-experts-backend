import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from './entities/material.entity';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';
import { Category } from 'src/category/entities/category.entity';
import { Language } from 'src/language/entities/language.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Material,Category,Language])],
  controllers: [MaterialController],
  providers: [MaterialService],
})
export class MaterialModule { }
