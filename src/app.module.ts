import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig), UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
