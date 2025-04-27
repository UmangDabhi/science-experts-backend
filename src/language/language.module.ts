import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import { Language } from './entities/language.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  controllers: [LanguageController],
  providers: [LanguageService],
})
export class LanguageModule { }
