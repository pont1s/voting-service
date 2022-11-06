import { Injectable } from '@nestjs/common';
import { RegistrationUserDto } from './dto/registration-user.dto';

@Injectable()
export class UsersService {
  registration(registrationUserDto: RegistrationUserDto) {
    return 'This action adds a new user';
  }
}
