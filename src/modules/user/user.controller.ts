import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { RegisterUserDto } from '../common/dto/userRegisterDto';
import { UsersService } from './user.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<{ message: string }> {
    try {
      return await this.usersService.register(registerUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }
}
