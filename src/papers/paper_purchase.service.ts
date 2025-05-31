import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERRORS } from 'src/Helper/message/error.message';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePaperPurchaseDto } from './dto/create-paper_purchase.dto';
import { Paper } from './entities/paper.entity';
import { PaperPurchase } from './entities/paper_purchase.entity';

@Injectable()
export class PaperPurchaseService {
  constructor(
    @InjectRepository(PaperPurchase)
    private readonly paperPurchaseRepository: Repository<PaperPurchase>,
    @InjectRepository(Paper)
    private readonly paperRepository: Repository<Paper>
  ) { }
  async create(currUser: User, createPaperPurchaseDto: CreatePaperPurchaseDto) {
    try {
      const existingPaper = await this.paperRepository.findOne({
        where: { id: createPaperPurchaseDto.paper },
      });
      if (!existingPaper) {
        throw new NotFoundException(ERRORS.ERROR_PAPER_NOT_FOUND);
      }
      const newPaper = await this.paperPurchaseRepository.save({
        paper: existingPaper,
        student: { id: currUser.id },
      });
      return newPaper;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error.code === '23505') {
        throw new ConflictException(ERRORS.ERROR_PAPER_PURCHASE_ALEARDY_EXISTS);
      }
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_PAPER_PURCHASE);
    }
  }

}
