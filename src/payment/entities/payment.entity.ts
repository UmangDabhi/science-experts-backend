import { PURCHASE_OF_TYPE } from 'src/Helper/constants';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: PURCHASE_OF_TYPE })
  type: PURCHASE_OF_TYPE;

  //  Safe for existing records: allows old rows to remain empty for now
  @Column({ nullable: true })
  itemId: string | null; 

  //  Safe for existing records: allows old rows to be empty without crashing migrations
  @ManyToOne(() => User, { eager: false, onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column()
  orderId: string;

  @Column()
  paymentId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  status: string;
}