import {
  Controller, Post, Body, Logger,
} from '@nestjs/common';

import { UsersService } from './users.service';

import { RegistrationUserDto } from './dto/registration-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post('registration')
  registration(@Body() registrationUserDto: RegistrationUserDto) {
    this.logger.log(JSON.stringify(registrationUserDto));
    return {
      token: this.usersService.registration(registrationUserDto),
    };
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return '';
  }
}
