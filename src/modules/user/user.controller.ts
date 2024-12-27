import {
  Controller,
  Post,
  Body,
  ConflictException,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { RegisterUserDto } from '../common/dto/userRegisterDto';
import { UsersService } from './user.service';
import { JwtAuthGuard } from '../common/guard/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUser(@Request() req) {
    const email = req.user.email;
    const userProfile = await this.usersService.getUserProfileByEmail(email);
    return userProfile;
  }
}
