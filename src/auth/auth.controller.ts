import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth') // Préfixe de route /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') // POST /auth/register
  @HttpCode(HttpStatus.CREATED) // Réponse 201 Created
  async register(@Body() registerUserDto: RegisterUserDto): Promise<{ message: string }> {
    return this.authService.register(registerUserDto);
  }

  @Post('login') // POST /auth/login
  @HttpCode(HttpStatus.OK) // Réponse 200 OK
  async login(@Body() loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginUserDto);
  }
}