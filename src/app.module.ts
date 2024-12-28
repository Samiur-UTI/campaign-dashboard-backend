import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProjectsModule } from './modules/project/project.module';
import { CampaignsModule } from './modules/campaign/campaign.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    UserModule,
    AuthModule,
    ProjectsModule,
    CampaignsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
