import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from '../common/entities/campaign.entity';
import { Project } from '../common/entities/project.entity';
import { Lead } from '../common/entities/leads.entity';
import { Connection } from '../common/entities/connection.entity';
import { CampaignsController } from './campaign.controller';
import { CampaignsService } from './campaign.service';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign, Project, Lead, Connection])],
  controllers: [CampaignsController],
  providers: [CampaignsService],
})
export class CampaignsModule {}
