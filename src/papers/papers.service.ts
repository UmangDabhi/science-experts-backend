import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePaperDto } from './dto/create-paper.dto';
import { UpdatePaperDto } from './dto/update-paper.dto';
import { Paper } from './entities/paper.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PaperPurchase } from './entities/paper_purchase.entity';
import { Category } from 'src/category/entities/category.entity';
import { Standard } from 'src/standard/entities/standard.entity';
import { Language } from 'src/language/entities/language.entity';
import { User } from 'src/user/entities/user.entity';
import { ERRORS } from 'src/Helper/message/error.message';
import { plainToInstance } from 'class-transformer';
import { PaperPublicDto } from './dto/paper-public.dto';
import { FilterDto } from 'src/Helper/dto/filter.dto';
import { Role } from 'src/Helper/constants';
import { pagniateRecords } from 'src/Helper/pagination/pagination.util';
import { PaginatedResult } from 'src/Helper/pagination/paginated-result.interface';

@Injectable()
export class PapersService {
  constructor(
    @InjectRepository(Paper)
    private readonly paperRepository: Repository<Paper>,
    @InjectRepository(PaperPurchase)
    private readonly paperPurchaseRepository: Repository<PaperPurchase>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Standard)
    private readonly standardRepository: Repository<Standard>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) { }
  async create(currUser: User, createPaperDto: CreatePaperDto) {
    try {
      const categoryEntities = createPaperDto.categories
        ? await this.categoryRepository.findBy({
          id: In(createPaperDto.categories),
        })
        : [];
      const standardEntities = createPaperDto.standards
        ? await this.standardRepository.findBy({
          id: In(createPaperDto.standards),
        })
        : [];
      const newPaper = this.paperRepository.create({
        ...createPaperDto,
        language: createPaperDto.language ? { id: createPaperDto.language } : undefined,
        categories: categoryEntities,
        standards: standardEntities,
        tutor: { id: currUser.id },
      });

      return await this.paperRepository.save(newPaper);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_PAPER);
    }
  }
  async manageAllPaper(currUser: User, filterDto: FilterDto) {
    try {
      const searchableFields: (keyof Paper)[] = ['title'];
      const queryOptions: any = {};
      const orderBy: any = {
        field: 'created_at',
        direction: 'DESC',
      };

      if (currUser && currUser.role == Role.TUTOR) {
        queryOptions.tutor = { id: currUser.id };
      }

      if (filterDto?.category) {
        queryOptions.categories = { id: filterDto.category };
      }

      if (filterDto?.standard) {
        queryOptions.standards = { id: filterDto.standard };
      }

      const sortOptions = {
        "Most Populer": { field: "created_at", direction: 'DESC', },
        "Price:Low to High": { field: "amount", direction: "ASC" },
        "Price:High to Low": { field: "amount", direction: "DESC" },
      };

      const selectedSort = sortOptions[filterDto?.sortby] || {};
      if (selectedSort) {
        orderBy.field = selectedSort.field || "";
        orderBy.direction = selectedSort.direction;
      }


      const papers = await pagniateRecords(
        this.paperRepository,
        filterDto,
        searchableFields,
        queryOptions,
        [],
        orderBy,
      );
      const result = papers;


      if (!currUser || currUser.role === Role.STUDENT) {
        const studentResult: PaginatedResult<PaperPublicDto> = {
          ...papers,
          data: papers.data.map(paper =>
            plainToInstance(PaperPublicDto, paper, {
              excludeExtraneousValues: true,
            }),
          ),
        };
        return studentResult;
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_PAPERS);
    }
  }

  async findAll(currUser: User, filterDto: FilterDto) {
    try {
      const searchableFields: (keyof Paper)[] = ['title'];
      const queryOptions: any = {};
      const orderBy: any = {
        field: 'created_at',
        direction: 'DESC',
      };

      if (currUser && currUser.role == Role.TUTOR) {
        queryOptions.tutor = { id: currUser.id };
      }

      if (filterDto?.category) {
        queryOptions.categories = { id: filterDto.category };
      }

      if (filterDto?.standard) {
        queryOptions.standards = { id: filterDto.standard };
      }

      const sortOptions = {
        "Most Populer": { field: "created_at", direction: 'DESC', },
        "Price:Low to High": { field: "amount", direction: "ASC" },
        "Price:High to Low": { field: "amount", direction: "DESC" },
      };

      const selectedSort = sortOptions[filterDto?.sortby] || {};
      if (selectedSort) {
        orderBy.field = selectedSort.field || "";
        orderBy.direction = selectedSort.direction;
      }


      const papers = await pagniateRecords(
        this.paperRepository,
        filterDto,
        searchableFields,
        queryOptions,
        [],
        orderBy,
      );
      const result = papers;


      if (!currUser || currUser.role === Role.STUDENT) {
        const studentResult: PaginatedResult<PaperPublicDto> = {
          ...papers,
          data: papers.data.map(paper =>
            plainToInstance(PaperPublicDto, paper, {
              excludeExtraneousValues: true,
            }),
          ),
        };
        return studentResult;
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_PAPERS);
    }
  }


  async findOne(currUser: User, id: string) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);

      const paper = await this.paperRepository.findOne({
        where: { id: id },
        relations: [
          'tutor',
          'categories',
          'standards',
          'language',
        ],
      });
      if (!paper)
        throw new NotFoundException(ERRORS.ERROR_PAPER_NOT_FOUND);
      if (currUser) {
        const paper_purchase = await this.paperPurchaseRepository.findOne({
          where: {
            paper: {
              id: paper.id,
            },
            student: {
              id: currUser?.id
            }
          }
        })
        if (paper_purchase)
          paper["is_purchased"] = true;
        else
          paper["is_purchased"] = false;
      }
      if (!currUser || currUser.role == Role.STUDENT) {
        plainToInstance(PaperPublicDto, paper, {
          excludeExtraneousValues: true,
        })
      }
      return paper;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_PAPER);
    }
  }

  async update(
    currUser: User,
    id: string,
    updatePaperDto: UpdatePaperDto,
  ) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      const whereCondition = currUser.role == Role.ADMIN ? { id: id } : { id: id, tutor: { id: currUser.id } }
      const paper = await this.paperRepository.findOne({
        where: whereCondition,
      });

      if (!paper)
        throw new NotFoundException(ERRORS.ERROR_PAPER_NOT_FOUND);
      const categoryEntities = updatePaperDto.categories
        ? await this.categoryRepository.findBy({
          id: In(updatePaperDto.categories),
        })
        : [];
      const standardEntities = updatePaperDto.standards
        ? await this.standardRepository.findBy({
          id: In(updatePaperDto.standards),
        })
        : [];
      const langaugeEntity = await this.languageRepository.findOne({
        where: { id: updatePaperDto.language }
      })
      const updateData: any = { ...updatePaperDto };
      updateData.tutor = { id: currUser.id };

      Object.assign(paper, {
        ...updatePaperDto,
        tutor: { id: currUser.id },
        categories: categoryEntities,
        standards: standardEntities,
        language: langaugeEntity,
      });

      await this.paperRepository.save(paper);
      return;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof NotFoundException
      )
        throw error;
      console.log(error)
      throw new InternalServerErrorException(ERRORS.ERROR_UPDATING_PAPER);
    }
  }

  async remove(currUser: User, id: string) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }
      const paper = await this.paperRepository.findOne({
        where: { id: id, tutor: { id: currUser.id } },
      });
      if (!paper) {
        throw new NotFoundException(ERRORS.ERROR_PAPER_NOT_FOUND);
      }
      await this.paperRepository.softDelete(id);
      return;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORS.ERROR_DELETING_PAPER);
    }
  }
}
