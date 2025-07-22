import { BaseEntity } from 'src/Helper/base.entity';
import { Column, Entity } from 'typeorm';

export enum TutorRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity()
export class TutorReq extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 15 })
  phone_no: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  qualifications: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  experience: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({
    type: 'enum',
    enum: TutorRequestStatus,
    default: TutorRequestStatus.PENDING,
  })
  status: TutorRequestStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  applied_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  reviewed_at: Date;
}
