import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guard/jwt-auth.guard';
import { CampaignsService } from './campaign.service';
import { CreateCampaignDto } from '../common/dto/createCampaignDto';
import { UpdateCampaignDto } from '../common/dto/updateCampaignDto';

@UseGuards(JwtAuthGuard)
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Get('/search/:projectId')
  async searchCampaigns(
    @Param('projectId') projectId: number,
    @Query('term') term?: string,
    @Query('ids') ids?: string, // Accepting ids as a comma-separated string
    @Query('createdBefore') createdBefore?: string,
    @Query('createdAfter') createdAfter?: string,
    @Query('leadsCount') leadsCount?: number,
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    // Parse ids from comma-separated string to an array of numbers
    const idsArray = ids ? ids.split(',').map((id) => Number(id)) : undefined;

    return this.campaignsService.searchCampaigns(projectId, {
      term,
      ids: idsArray,
      createdBefore,
      createdAfter,
      leadsCount,
      sortOrder,
      page,
      limit,
    });
  }

  @Get('/names/:projectId')
  async getCampaignNames(@Param('projectId') projectId: number) {
    return this.campaignsService.findAllCampaignNamesByProjectId(projectId);
  }

  @Get('/details/:projectId')
  async getCampaignDetails(
    @Query('ids') ids: number[],
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.campaignsService.fetchCampaignDetailsByIds(ids, page, limit);
  }

  @Post('/create')
  async create(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignsService.create(createCampaignDto);
  }

  @Patch('/:projectId/:campaignId')
  async update(
    @Param('id') id: number,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ) {
    return this.campaignsService.update(id, updateCampaignDto);
  }

  @Delete('/:projectId/:campaignId')
  async remove(@Param('id') id: number) {
    await this.campaignsService.remove(id);
  }
}
