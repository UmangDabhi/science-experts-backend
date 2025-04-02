import { CreateReviewDto } from './create-review.dto';
declare const UpdateTestimonialDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateReviewDto>>;
export declare class UpdateTestimonialDto extends UpdateTestimonialDto_base {
    show_as_testimonials: Boolean;
}
export {};
