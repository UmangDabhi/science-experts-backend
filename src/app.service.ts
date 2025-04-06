// app.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity'; // adjust path
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from './Helper/constants';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

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
  }
}
