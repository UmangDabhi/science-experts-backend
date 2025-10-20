import { BaseEntity } from 'src/Helper/base.entity';
import { EMAIL_STATUS, EMAIL_TEMPLATE_TYPE } from 'src/Helper/constants';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class EmailLog extends BaseEntity {
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 200 })
  to_email: string;

  @Column({ type: 'varchar', length: 200 })
  subject: string;

  @Column({
    type: 'enum',
    enum: EMAIL_TEMPLATE_TYPE,
  })
  template_type: EMAIL_TEMPLATE_TYPE;

  @Column({
    type: 'enum',
    enum: EMAIL_STATUS,
    default: EMAIL_STATUS.PENDING,
  })
  status: EMAIL_STATUS;

  @Column({ type: 'text', nullable: true })
  error_message: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  message_id: string;

  @Column({ type: 'timestamp', nullable: true })
  sent_at: Date;

  @Column({ type: 'int', default: 0 })
  retry_count: number;
}
