import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(createCategoryDto: CreateCategoryDto): Promise<import("./entities/category.entity").Category>;
    findAll(paginationDto: PaginationDto): Promise<import("../Helper/pagination/paginated-result.interface").PaginatedResult<import("./entities/category.entity").Category>>;
    findOne(id: string): Promise<import("./entities/category.entity").Category>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<void>;
    remove(id: string): Promise<void>;
}
