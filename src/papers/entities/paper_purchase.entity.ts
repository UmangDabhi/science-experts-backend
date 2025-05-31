import { BaseEntity } from 'src/Helper/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Paper } from './paper.entity';

@Entity()
@Unique(['student', 'paper'])
export class PaperPurchase extends BaseEntity {
    @ManyToOne(() => User, (user) => user.paper_purchases)
    @JoinColumn({ name: 'student_id' })
    student: User;

    @ManyToOne(() => Paper, (paper) => paper.paper_purchases)
    @JoinColumn({ name: 'paper_id' })
    paper: Paper;

    @Column({ nullable: true })
    feedback: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    purchased_at: Date;

}
