// app.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity'; // adjust path
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { BALANCE_TYPE, COIN_VALUE_TYPE, Role } from './Helper/constants';
import { Balance_Type } from './user/entities/balance_type.entity';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Balance_Type)
    private balanceTypeRepository: Repository<Balance_Type>,
  ) { }

  async onModuleInit() {
    const count = await this.userRepository.count();
    if (count === 0) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      const user = this.userRepository.create({
        name: 'Admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        phone_no: '9876543210',
        address: '123 ABC Street',
        city: 'Cityville',
        state: 'Statestan',
        pincode: '123456',
        role: Role.ADMIN,
      });

      await this.userRepository.save(user);
      console.log('✅ Default user inserted.');
    } else {
      console.log(`ℹ️ Users already exist (${count}), skipping seeding.`);
    }

    const balance_type_count = await this.balanceTypeRepository.count();
    if (balance_type_count === 0) {
      await this.balanceTypeRepository.save({
        type: BALANCE_TYPE.WELCOME_BONUS,
        value: 50,
        withdrawable: false,
        coin_type: COIN_VALUE_TYPE.DIRECT
      })
      await this.balanceTypeRepository.save({
        type: BALANCE_TYPE.REFERRER_SIGNUP_BONUS,
        value: 20,
        withdrawable: false,
        coin_type: COIN_VALUE_TYPE.DIRECT
      })
      await this.balanceTypeRepository.save({
        type: BALANCE_TYPE.REFEREE_SIGNUP_BONUS,
        value: 10,
        withdrawable: false,
        coin_type: COIN_VALUE_TYPE.DIRECT
      })
      await this.balanceTypeRepository.save({
        type: BALANCE_TYPE.REFERRAL_PURCHASE_BONUS,
        value: 5,
        withdrawable: true,
        coin_type: COIN_VALUE_TYPE.PERCENTAGE
      })
      console.log('✅ Default Balance Types inserted.');

    } else {
      console.log(`ℹ️ Balance Type already exist (${balance_type_count}), skipping seeding.`);
    }

  }

  getHello(): string {
    return 'Hello World!';
  }
}
