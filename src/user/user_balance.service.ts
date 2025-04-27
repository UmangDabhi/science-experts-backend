import {
  Injectable
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { User_Balance } from './entities/user_balance.entity';
import { BALANCE_TYPE, COIN_VALUE_TYPE } from 'src/Helper/constants';
import { Balance_Type } from './entities/balance_type.entity';

@Injectable()
export class UserBalanceService {
  constructor(
    @InjectRepository(User_Balance)
    private readonly userBalanceRepository: Repository<User_Balance>,
    @InjectRepository(Balance_Type)
    private readonly balanceTypeRepository: Repository<Balance_Type>,
  ) { }

  async addCoins(currUser: User, type: BALANCE_TYPE, description: string = null, amount: number = 0) {
    try {

      const existing_record = await this.userBalanceRepository.findOne({
        where: { user: currUser, type: type }
      })
      const balance_type = await this.balanceTypeRepository.findOne({ where: { type } });
      let coins = 0;
      if (balance_type.coin_type == COIN_VALUE_TYPE.DIRECT) {
        coins = balance_type.value
      } else {
        coins = amount * balance_type.value / 100;
      }
      if (existing_record) {
        const new_expert_coins = existing_record.expert_coins + coins
        await this.userBalanceRepository.update({ user: currUser }, { expert_coins: new_expert_coins })
      } else {
        await this.userBalanceRepository.save({
          user: currUser,
          expert_coins: coins,
          description,
          type,
          balance_type
        })
      }
      return true;
    } catch (err) {
      console.log(err)
      return false;

    }
  }

  async getAllCoins(currUser: User) {
    try {
      const user_balance = await this.userBalanceRepository.find({ where: { user: { id: currUser.id } } })
      const totalExpertCoins = user_balance.reduce((accumulator, item) => {
        return accumulator + item.expert_coins;
      }, 0);

      return totalExpertCoins;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
  async deductCoins(currUser: User, amount: number) {
    try {
      let remainingAmount = amount;

      const nonWithdrawableBalances = await this.userBalanceRepository.find({
        where: {
          user: currUser,
          balance_type: { withdrawable: false }
        },
        order: { expert_coins: 'DESC' },
      });

      const withdrawableBalances = await this.userBalanceRepository.find({
        where: {
          user: currUser,
          balance_type: { withdrawable: true }
        },
        order: { expert_coins: 'DESC' },
      });

      const allBalances = [...nonWithdrawableBalances, ...withdrawableBalances];

      for (const balance of allBalances) {
        if (remainingAmount <= 0) break;

        if (balance.expert_coins >= remainingAmount) {
          balance.expert_coins -= remainingAmount;
          remainingAmount = 0;
        } else {
          remainingAmount -= balance.expert_coins;
          balance.expert_coins = 0;
        }

        await this.userBalanceRepository.save(balance);
      }

      if (remainingAmount > 0) {
        throw new Error('Insufficient balance');
      }

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

}
