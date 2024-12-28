import { IsString, IsOptional, IsEnum } from 'class-validator';
import { CampaignStatus } from '../entities/campaign.entity';

export class UpdateCampaignDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(CampaignStatus)
  status?: CampaignStatus;
}
