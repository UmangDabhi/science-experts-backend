import { Category } from 'src/category/entities/category.entity';
import { BaseEntity } from 'src/Helper/base.entity';
import { Language } from 'src/language/entities/language.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Standard } from 'src/standard/entities/standard.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BookPurchase } from './book_purchase.entity';
import { Is_Paid } from 'src/Helper/constants';

@Entity()
export class Book extends BaseEntity {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ nullable: true })
    thumbnail_url: string;

    @Column()
    book_url: string;

    @ManyToOne(() => User, (tutor) => tutor.tutor_books)
    @JoinColumn({ name: 'tutor_id' })
    tutor: User;

    @ManyToOne(() => Language, (language) => language.books, { nullable: true })
    @JoinColumn({ name: 'language_id' })
    language: Language;

    @Column({
        type: 'boolean',
        enum: Is_Paid,
        default: Is_Paid.NO,
    })
    is_paid: boolean;

    @Column({
        nullable: true
    })
    amount: number;

    @ManyToMany(() => Category, (categories) => categories.courses)
    @JoinTable({
        name: 'book_category_mapping',
        joinColumn: { name: 'book_id', referencedColumnName: 'id', },
        inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
    })
    categories: Category[];

    @ManyToMany(() => Standard, (standards) => standards.courses)
    @JoinTable({
        name: 'book_standard_mapping',
        joinColumn: { name: 'book_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'standard_id', referencedColumnName: 'id' },
    })
    standards: Standard[];

    @OneToMany(() => BookPurchase, (book_purchases) => book_purchases.book)
    book_purchases: BookPurchase[];

    @OneToMany(() => Review, (reviews) => reviews.book)
    reviews: Review[];
}
