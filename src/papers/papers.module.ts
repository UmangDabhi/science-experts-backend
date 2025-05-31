import { Module } from '@nestjs/common';
import { PapersService } from './papers.service';
import { PapersController } from './papers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paper } from './entities/paper.entity';
import { PaperPurchase } from './entities/paper_purchase.entity';
import { Category } from 'src/category/entities/category.entity';
import { Language } from 'src/language/entities/language.entity';
import { Standard } from 'src/standard/entities/standard.entity';
import { PaperPurchaseService } from './paper_purchase.service';

@Module({
  imports: [TypeOrmModule.forFeature([Paper, PaperPurchase, Category, Language, Standard])],
  controllers: [PapersController],
  providers: [PapersService, PaperPurchaseService],
  exports: [PapersService, PaperPurchaseService],
})
export class PapersModule { }
