import { Category } from 'src/category/entities/category.entity';
import { BaseEntity } from 'src/Helper/base.entity';
import { Is_Approved } from 'src/Helper/constants';
import { Language } from 'src/language/entities/language.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Standard } from 'src/standard/entities/standard.entity';
import { User } from 'src/user/entities/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
} from 'typeorm';
@Entity()
export class Blog extends BaseEntity {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ nullable: true })
    blog_content: string;

    @Column({ nullable: true })
    thumbnail_url: string;

    @Column({
        type: 'boolean',
        enum: Is_Approved,
        default: Is_Approved.NO,
    })
    is_approved: boolean;

    @ManyToOne(() => User, (tutor) => tutor.courses, { eager: true })
    @JoinColumn({ name: 'tutor_id' })
    tutor: User;

    @ManyToOne(() => Language, (language) => language.courses, { eager: true, nullable: true })
    @JoinColumn({ name: 'language' })
    language: Language;

    @OneToMany(() => Review, (reviews) => reviews.course)
    reviews: Review[];

    @ManyToMany(() => Category, (categories) => categories.courses, { nullable: true })
    @JoinTable({
        name: 'blog_category_mapping',
        joinColumn: { name: 'blog_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
    })
    categories: Category[];


    @ManyToMany(() => Standard, (standards) => standards.courses, { nullable: true })
    @JoinTable({
        name: 'blog_standard_mapping',
        joinColumn: { name: 'blog_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'standard_id', referencedColumnName: 'id' },
    })
    standards: Standard[];
}
