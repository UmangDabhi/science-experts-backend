// src/auth/auth.controller.ts
import { Controller, Post, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate-token')
  async validateToken(@Request() req) {
    return this.authService.validateToken(req.user);
  }
}
