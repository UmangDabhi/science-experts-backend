import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { PaginationDto } from 'src/Helper/pagination/pagination.dto';
import { CounterService } from 'src/counter/counter.service';
export declare class UserService {
    private readonly userRepository;
    private readonly counterService;
    constructor(userRepository: Repository<User>, counterService: CounterService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(paginationDto: PaginationDto): Promise<import("../Helper/pagination/paginated-result.interface").PaginatedResult<User>>;
    findAllTutor(paginationDto: PaginationDto): Promise<import("../Helper/pagination/paginated-result.interface").PaginatedResult<User>>;
    findOne(id: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<void>;
    remove(id: string): Promise<void>;
    findByEmail(email: string): Promise<User>;
}
