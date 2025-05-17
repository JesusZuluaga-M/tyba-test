import { Controller, Post, Body, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { RequestWithSession } from 'src/types/request-with-session';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  create(@Body() createdUser: CreateUserDto) {
    return this.authService.createUser(createdUser);
  }

  @Post('/login')
  login(@Body() loggedUser: LoginUserDto) {
    return this.authService.loginUser(loggedUser);
  }

  @Get('/me')
  session(@Request() req: RequestWithSession) {
    if (!req.session) {
      return { message: 'No session found' };
    }
    return req.session;
  }
}
