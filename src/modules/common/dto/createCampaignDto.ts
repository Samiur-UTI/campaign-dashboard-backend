import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { CampaignStatus } from '../entities/campaign.entity';

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(CampaignStatus)
  status: CampaignStatus;

  @IsNotEmpty()
  projectId: number;
}
