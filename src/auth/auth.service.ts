// src/auth/auth.service.ts
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(user: User) {
    const user_data = await this.userService.findByEmail(user.email);
    if (!user_data) throw new UnauthorizedException('User Not Found');
    if (!(await bcrypt.compare(user.password, user_data.password)))
      throw new ConflictException('Wrong Password');

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      user_data: {
        id: user_data.id,
        name: user_data.name,
        role: user_data.role,
        email: user_data.email,
      },
      access_token: this.jwtService.sign(payload),
    };
  }
}
