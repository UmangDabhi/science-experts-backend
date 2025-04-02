import { BaseEntity } from 'src/Helper/base.entity';
import { User } from 'src/user/entities/user.entity';
export declare class Certificate extends BaseEntity {
    title: string;
    description: string;
    certificate_url: string;
    student: User;
}
