import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Campaign } from '../common/entities/campaign.entity';
import { Project } from '../common/entities/project.entity';
import { Lead } from '../common/entities/leads.entity';
import { Connection } from '../common/entities/connection.entity';
import { CreateCampaignDto } from '../common/dto/createCampaignDto';
import { UpdateCampaignDto } from '../common/dto/updateCampaignDto';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private campaignRepository: Repository<Campaign>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
    @InjectRepository(Connection)
    private connectionRepository: Repository<Connection>,
  ) {}

  async create(createCampaignDto: CreateCampaignDto): Promise<Campaign> {
    const { projectId, ...rest } = createCampaignDto;

    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const campaign = this.campaignRepository.create({
      ...rest,
      project: project, // Link the campaign to the project
    });

    return await this.campaignRepository.save(campaign);
  }

  async update(
    id: number,
    updateCampaignDto: UpdateCampaignDto,
  ): Promise<Campaign> {
    const campaign = await this.campaignRepository.findOne({ where: { id } });
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    Object.assign(campaign, updateCampaignDto);
    return await this.campaignRepository.save(campaign);
  }

  async remove(id: number): Promise<void> {
    const campaign = await this.campaignRepository.findOne({ where: { id } });
    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    // Find all leads associated with this campaign
    const leads = await this.leadRepository.find({
      where: { campaign: { id } },
    });

    // Remove all connections associated with these leads
    const leadIds = leads.map((lead) => lead.id);
    await this.connectionRepository.delete({ lead: In(leadIds) });

    // Remove leads
    await this.leadRepository.delete({ campaign: { id } });

    await this.campaignRepository.remove(campaign);
  }

  async searchCampaigns(
    projectId: number,
    {
      term,
      ids,
      createdBefore, // Adjust these two based on actual column names in your entity
      createdAfter, // Adjust these two based on actual column names in your entity
      leadsCount,
      sortOrder = 'ASC',
      page = 1,
      limit = 10,
    }: {
      term?: string;
      ids?: number[];
      createdBefore?: string; // Ensure these types reflect your actual usage
      createdAfter?: string;
      leadsCount?: number;
      sortOrder?: 'ASC' | 'DESC';
      page?: number;
      limit?: number;
    } = {},
  ) {
    const skip = (page - 1) * limit;

    const query = this.campaignRepository
      .createQueryBuilder('campaign')
      .where('campaign.projectId = :projectId', { projectId });

    // Add filters
    if (term) {
      query.andWhere('campaign.name LIKE :term', { term: `%${term}%` });
    }

    if (ids && ids.length) {
      query.andWhere('campaign.id IN (:...ids)', { ids });
    }

    // Replace 'campaign.createdAt' with your actual creation date field name
    if (createdBefore) {
      query.andWhere('campaign.createdAt < :createdBefore', { createdBefore });
    }

    if (createdAfter) {
      query.andWhere('campaign.createdAt > :createdAfter', { createdAfter });
    }

    // If leadsCount is specified, perform a subquery to count leads
    if (leadsCount !== undefined) {
      query.andWhere(
        `(SELECT COUNT(lead.id) FROM leads lead WHERE lead.campaignId = campaign.id) = :leadsCount`,
        { leadsCount },
      );
    }

    // Sort the results
    query.orderBy('campaign.createdAt', sortOrder).skip(skip).take(limit);

    const [results, totalCount] = await query.getManyAndCount();

    return {
      data: results,
      totalRecords: totalCount,
      page,
      limit,
    };
  }

  async findAllCampaignNamesByProjectId(
    projectId: number,
  ): Promise<{ name: string; id: number }[]> {
    const campaigns = await this.campaignRepository.find({
      where: { project: { id: projectId } },
      select: ['name', 'id'],
    });

    return campaigns.map((campaign) => {
      return {
        name: campaign.name,
        id: campaign.id,
      };
    });
  }

  async fetchCampaignDetailsByIds(ids: number[], page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [result, totalCount] = await this.campaignRepository.findAndCount({
      where: { id: In(ids) },
      relations: ['project', 'leads', 'leads.connection'],
      skip,
      take: limit,
    });

    return {
      data: result,
      totalRecords: totalCount,
      page,
      limit,
    };
  }
}
