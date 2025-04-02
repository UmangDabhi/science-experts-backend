export declare class CreateCourseDto {
    title: string;
    description: string;
    detail_description?: string;
    thumbnail_url?: string;
    is_paid: boolean;
    price?: number;
    discount?: number;
    is_approved?: boolean;
    categories?: string[];
    standards?: string[];
}
