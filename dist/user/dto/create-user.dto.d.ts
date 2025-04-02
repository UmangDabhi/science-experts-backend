import { Role } from 'src/Helper/constants';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role?: Role;
    phone_no?: string;
    secondary_phone_no?: string;
    standard?: string;
    school?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
}
