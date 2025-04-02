import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
export declare class AuthService {
    private readonly userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    login(user: User): Promise<{
        user_data: {
            id: string;
            name: string;
            role: import("../Helper/constants").Role;
            email: string;
        };
        access_token: string;
    }>;
}
