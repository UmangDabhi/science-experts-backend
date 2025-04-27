import { BaseEntity } from 'src/Helper/base.entity';
import { BALANCE_TYPE, COIN_VALUE_TYPE } from 'src/Helper/constants';
import { Column, Entity } from 'typeorm';

@Entity()
export class Balance_Type extends BaseEntity {

  @Column({ type: "enum", enum: BALANCE_TYPE, default: BALANCE_TYPE.OTHERS })
  type: BALANCE_TYPE;

  @Column({ type: "enum", enum: COIN_VALUE_TYPE, default: COIN_VALUE_TYPE.DIRECT })
  coin_type: COIN_VALUE_TYPE;

  @Column({ type: "double precision", default: 0.0 })
  value: number;

  @Column({ type: "boolean", default: false })
  withdrawable: boolean;

}
