import { BaseEntity } from 'src/Helper/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Book } from './book.entity';

@Entity()
@Unique(['student', 'book'])
export class BookPurchase extends BaseEntity {
    @ManyToOne(() => User, (user) => user.book_purchases)
    @JoinColumn({ name: 'student_id' })
    student: User;

    @ManyToOne(() => Book, (book) => book.book_purchases)
    @JoinColumn({ name: 'book_id' })
    book: Book;

    @Column({ nullable: true })
    feedback: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    purchased_at: Date;

}
