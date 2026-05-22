import { BaseEntity } from 'src/Helper/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Paper } from './paper.entity';

@Entity()
@Unique(['student', 'paper'])
export class PaperPurchase extends BaseEntity {
    @Index()
    @ManyToOne(() => User, (user) => user.paper_purchases)
    @JoinColumn({ name: 'student_id' })
    student: User;

    @Index()
    @ManyToOne(() => Paper, (paper) => paper.paper_purchases)
    @JoinColumn({ name: 'paper_id' })
    paper: Paper;

    @Column({ nullable: true })
    feedback: string;

    @Index()
    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    purchased_at: Date;

}
