import { PURCHASE_OF_TYPE } from 'src/Helper/constants';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "enum", enum: PURCHASE_OF_TYPE, })
  type: PURCHASE_OF_TYPE;

  @Column()
  orderId: string;

  @Column()
  paymentId: string;

  @Column('decimal')
  amount: number;

  @Column()
  status: string;
}
