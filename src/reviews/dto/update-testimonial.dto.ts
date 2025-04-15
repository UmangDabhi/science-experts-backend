import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { IsBoolean } from 'class-validator';

export class UpdateTestimonialDto extends PartialType(CreateReviewDto) {
    @IsBoolean()
    show_as_testimonials: boolean
}
