import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../common/entities/user.entity';
import { Profile } from '../common/entities/profile.entity';
import { RegisterUserDto } from '../common/dto/userRegisterDto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async register(
    registerUserDto: RegisterUserDto,
  ): Promise<{ message: string }> {
    const { email, password, firstName, lastName, phone } = registerUserDto;

    // Check if the user already exists
    const existingUser = await this.findUserByEmail(email);
    console.log('USER INFO', existingUser);
    if (existingUser) {
      throw new ConflictException('Email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Use a transaction to ensure both inserts succeed
    await this.userRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const user = entityManager.create(User, {
          email,
          password: hashedPassword,
        });

        const savedUser = await entityManager.save(User, user);

        const profile = entityManager.create(Profile, {
          user: savedUser,
          firstName,
          lastName,
          phone,
        });

        await entityManager.save(Profile, profile);
      },
    );
    return { message: 'User registered successfully' };
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async getUserProfileByEmail(
    email: string,
  ): Promise<{ email: string; profile: Profile }> {
    const userWithProfile = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.email = :email', { email })
      .select(['user.email', 'profile']) // Select only the user email and all profile fields
      .getOne();

    if (!userWithProfile) {
      throw new NotFoundException('User not found');
    }

    return { email: userWithProfile.email, profile: userWithProfile.profile }; // Return only the email and profile information
  }
}
