import { Module } from '@nestjs/common';
import { StandardService } from './standard.service';
import { StandardController } from './standard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Standard } from './entities/standard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Standard])],
  controllers: [StandardController],
  providers: [StandardService],
})
export class StandardModule { }
