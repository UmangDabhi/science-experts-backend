import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Counter } from 'src/counter/counter.entity';
import { CounterService } from 'src/counter/counter.service';
import { User_Balance } from './entities/user_balance.entity';
import { UserBalanceService } from './user_balance.service';
import { Balance_Type } from './entities/balance_type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, User_Balance, Balance_Type, Counter])],
  controllers: [UserController],
  providers: [UserService, UserBalanceService, CounterService],
  exports: [UserService],
})
export class UserModule { }
