import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: string;

  @Column()
  paymentId: string;

  @Column('decimal')
  amount: number;

  @Column()
  status: string;
}
