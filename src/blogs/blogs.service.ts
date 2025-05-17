import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { Standard } from 'src/standard/entities/standard.entity';
import { Language } from 'src/language/entities/language.entity';
import { User } from 'src/user/entities/user.entity';
import { ERRORS } from 'src/Helper/message/error.message';
import { BlogFilterDto } from './dto/filter-blog.dto';
import { PaginatedResult } from 'src/Helper/pagination/paginated-result.interface';
import { Is_Approved, Role } from 'src/Helper/constants';
import { pagniateRecords } from 'src/Helper/pagination/pagination.util';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Standard)
    private readonly standardRepository: Repository<Standard>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) { }

  async create(currUser: User, createBlogDto: CreateBlogDto): Promise<any> {
    try {
      const categoryEntities = createBlogDto.categories
        ? await this.categoryRepository.findBy({
          id: In(createBlogDto.categories),
        })
        : [];

      const standardEntities = createBlogDto.standards
        ? await this.standardRepository.findBy({
          id: In(createBlogDto.standards),
        })
        : [];

      const langaugeEntity = await this.languageRepository.findOne({
        where: { id: createBlogDto.language }
      })

      const newBlog = this.blogRepository.create({
        ...createBlogDto,
        tutor: { id: currUser.id },
        language: langaugeEntity,
        categories: categoryEntities,
        standards: standardEntities,
      });
      return await this.blogRepository.save(newBlog);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(ERRORS.ERROR_CREATING_BLOG);
    }
  }

  async findAll(
    blogFilterDto: BlogFilterDto,
  ): Promise<PaginatedResult<Blog>> {
    try {
      const searchableFields: (keyof Blog)[] = ['title'];
      const queryOptions: any = {};

      if (blogFilterDto?.category) {
        queryOptions.categories = { id: blogFilterDto.category };
      }
      if (blogFilterDto?.standard) {
        queryOptions.standards = { id: blogFilterDto.standard };
      }
      queryOptions.is_approved = Is_Approved.YES
      const relations = ["reviews"];
      const result = await pagniateRecords(
        this.blogRepository,
        blogFilterDto,
        searchableFields,
        queryOptions,
        relations
      );

      return result;
    } catch (error) {
      console.log(error)

      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_BLOGS);
    }
  }

  async manageAllBlog(
    currUser: User,
    blogFilterDto: BlogFilterDto,
  ): Promise<PaginatedResult<Blog>> {
    try {
      const searchableFields: (keyof Blog)[] = ['title'];
      const queryOptions: any = {};

      if (blogFilterDto?.category) {
        queryOptions.categories = { id: blogFilterDto.category };
      }
      if (blogFilterDto?.standard) {
        queryOptions.standards = { id: blogFilterDto.standard };
      }
      if (currUser.role == Role.TUTOR) {
        queryOptions.tutor = { id: currUser.id };
      }
      const relations = ["reviews"];
      const result = await pagniateRecords(
        this.blogRepository,
        blogFilterDto,
        searchableFields,
        queryOptions,
        relations
      );

      return result;
    } catch (error) {
      console.log(error)

      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_COURSES);
    }
  }

  async findOne(id: string) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);

      const blog = await this.blogRepository.findOne({
        where: { id: id },
        relations: [
          'tutor',
          'categories',
          'standards',
          'language',
          'reviews',
        ],
      });
      if (!blog) throw new NotFoundException(ERRORS.ERROR_BLOG_NOT_FOUND);

      return blog;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      )
        throw error;
      console.log(error)
      throw new InternalServerErrorException(ERRORS.ERROR_FETCHING_BLOG);
    }
  }
  async update(currUser: User, id: string, updateBlogDto: UpdateBlogDto) {
    try {
      if (!id) throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      const whereCondition = currUser.role == Role.ADMIN ? { id: id } : { id: id, tutor: { id: currUser.id } }
      const blog = await this.blogRepository.findOne({
        where: whereCondition,
      });
      if (!blog) throw new NotFoundException(ERRORS.ERROR_BLOG_NOT_FOUND);
      const categoryEntities = updateBlogDto.categories
        ? await this.categoryRepository.findBy({
          id: In(updateBlogDto.categories),
        })
        : [];

      const standardEntities = updateBlogDto.standards
        ? await this.standardRepository.findBy({
          id: In(updateBlogDto.standards),
        })
        : [];

      const langaugeEntity = await this.languageRepository.findOne({
        where: { id: updateBlogDto.language }
      })

      Object.assign(blog, {
        ...updateBlogDto,
        tutor: { id: currUser.id },
        categories: categoryEntities,
        language: langaugeEntity,
        standards: standardEntities,
      });

      await this.blogRepository.save(blog);
      return;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof NotFoundException
      )
        throw error;
      console.log(error)
      throw new InternalServerErrorException(ERRORS.ERROR_UPDATING_BLOG);
    }
  }


  async remove(currUser: User, id: string) {
    try {
      if (!id) {
        throw new BadRequestException(ERRORS.ERROR_ID_NOT_PROVIDED);
      }
      const blog = await this.blogRepository.findOne({
        where: { id: id, tutor: { id: currUser.id } },
      });
      if (!blog) {
        throw new NotFoundException(ERRORS.ERROR_BLOG_NOT_FOUND);
      }
      await this.blogRepository.softDelete(id);
      return;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(ERRORS.ERROR_DELETING_BLOG);
    }
  }

}
