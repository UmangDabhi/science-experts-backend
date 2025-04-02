import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    findAll(paginationDto: PaginationDto): Promise<import("../Helper/pagination/paginated-result.interface").PaginatedResult<import("./entities/user.entity").User>>;
    findAllTutor(paginationDto: PaginationDto): Promise<import("../Helper/pagination/paginated-result.interface").PaginatedResult<import("./entities/user.entity").User>>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<void>;
    remove(id: string): Promise<void>;
}
