// src/auth/auth.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailService } from './email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async login(user: User) {
    const user_data = await this.userService.findByEmail(user.email);
    if (!user_data) throw new UnauthorizedException('User Not Found');
    if (!(await bcrypt.compare(user.password, user_data.password)))
      throw new ConflictException('Wrong Password');

    const payload = {
      email: user_data.email,
      sub: user_data.id,
      role: user_data.role,
    };
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

  async validateToken(user: User) {
    try {
      if (!user) {
        throw new UnauthorizedException('Invalid token or user not found');
      }

      const current_user = await this.userService.findByEmail(user.email);
      if (!current_user) {
        throw new UnauthorizedException('User no longer exists');
      }

      return {
        valid: true,
        user: {
          id: current_user.id,
          name: current_user.name,
          role: current_user.role,
          email: current_user.email,
        }
      };
    } catch (error) {
      throw new UnauthorizedException('Token validation failed');
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const genericResponse = {
      message: 'If an account exists for this email, a password reset link has been sent.',
    };

    let user: User;
    try {
      user = await this.userService.findByEmail(forgotPasswordDto.email);
    } catch (error) {
      return genericResponse;
    }

    const token = await this.jwtService.signAsync(
      {
        email: user.email,
        sub: user.id,
        purpose: 'password-reset',
      },
      {
        secret: this.getPasswordResetSecret(user),
        expiresIn: '1h',
      },
    );
    const resetUrl = this.buildResetUrl(user.email, token);
    await this.emailService.sendPasswordResetEmail(user.email, resetUrl);

    if (this.configService.get<string>('NODE_ENV') !== 'production' && !this.emailService.isConfigured()) {
      return { ...genericResponse, resetUrl };
    }

    return genericResponse;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    let user: User;
    try {
      user = await this.userService.findByEmail(resetPasswordDto.email);
      const payload = await this.jwtService.verifyAsync(resetPasswordDto.token, {
        secret: this.getPasswordResetSecret(user),
      });

      if (
        payload?.purpose !== 'password-reset' ||
        payload?.sub !== user.id ||
        payload?.email !== user.email
      ) {
        throw new BadRequestException();
      }
    } catch (error) {
      throw new BadRequestException('Password reset link is invalid or expired');
    }

    await this.userService.updatePassword(user.id, resetPasswordDto.newPassword);
    return { message: 'Password reset successfully' };
  }

  async changePassword(user: User, changePasswordDto: ChangePasswordDto) {
    const currentUser = await this.userService.findByEmail(user.email);

    if (!(await bcrypt.compare(changePasswordDto.currentPassword, currentUser.password))) {
      throw new BadRequestException('Current password is incorrect');
    }

    if (await bcrypt.compare(changePasswordDto.newPassword, currentUser.password)) {
      throw new BadRequestException('New password must be different from current password');
    }

    await this.userService.updatePassword(currentUser.id, changePasswordDto.newPassword);
    return { message: 'Password changed successfully' };
  }

  private getPasswordResetSecret(user: User) {
    return `${this.configService.get<string>('JWT_SECRET')}:${user.password}`;
  }

  private buildResetUrl(email: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const url = new URL('/resetPassword', frontendUrl);
    url.searchParams.set('email', email);
    url.searchParams.set('token', token);
    return url.toString();
  }
}
