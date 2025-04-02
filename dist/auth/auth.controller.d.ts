import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any): Promise<{
        user_data: {
            id: string;
            name: string;
            role: import("../Helper/constants").Role;
            email: string;
        };
        access_token: string;
    }>;
}
