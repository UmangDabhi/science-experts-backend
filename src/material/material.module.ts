import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from './entities/material.entity';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';
import { Category } from 'src/category/entities/category.entity';
import { Language } from 'src/language/entities/language.entity';
import { Standard } from 'src/standard/entities/standard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Material, Category, Language, Standard])],
  controllers: [MaterialController],
  providers: [MaterialService],
})
export class MaterialModule { }
