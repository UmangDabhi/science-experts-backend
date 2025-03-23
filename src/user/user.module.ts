import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Counter } from 'src/counter/counter.entity';
import { CounterService } from 'src/counter/counter.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Counter])],
  controllers: [UserController],
  providers: [UserService, CounterService],
  exports: [UserService],
})
export class UserModule {}
