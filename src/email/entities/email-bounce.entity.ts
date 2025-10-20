import { BaseEntity } from 'src/Helper/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class EmailBounce extends BaseEntity {
  @Column({ type: 'varchar', length: 200, unique: true })
  email: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 50, default: 'hard' })
  bounce_type: string;

  @Column({ type: 'text', nullable: true })
  bounce_reason: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  bounced_at: Date;

  @Column({ default: 1 })
  bounce_count: number;
}