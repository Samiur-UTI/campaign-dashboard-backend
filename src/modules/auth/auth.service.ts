import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../user/user.service';
import { User } from '../common/entities/user.entity';
import { LoginUserDto } from '../common/dto/userLoginDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await this.comparePasswords(password, user.password))) {
      return user;
    }
    return null;
  }

  private async comparePasswords(
    rawPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(rawPassword, hashedPassword);
  }

  async login(loginUserDto: LoginUserDto): Promise<{ accessToken: string }> {
    const { email, password } = loginUserDto;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '3h' }),
    };
  }
}
