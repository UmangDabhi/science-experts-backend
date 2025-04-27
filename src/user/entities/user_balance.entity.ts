import { BaseEntity } from 'src/Helper/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BALANCE_TYPE } from 'src/Helper/constants';
import { Balance_Type } from './balance_type.entity';

@Entity()
export class User_Balance extends BaseEntity {

  @ManyToOne(() => User, (user) => user.user_balance, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: "double precision", default: 0.0 })
  expert_coins: number;

  @Column({ type: "enum", enum: BALANCE_TYPE, default: BALANCE_TYPE.OTHERS })
  type: BALANCE_TYPE;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Balance_Type, { eager: true })
  @JoinColumn({ name: 'balance_type_id' })
  balance_type: Balance_Type;
}

