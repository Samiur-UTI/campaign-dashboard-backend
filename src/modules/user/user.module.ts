import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../common/entities/user.entity';
import { Profile } from '../common/entities/profile.entity';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
