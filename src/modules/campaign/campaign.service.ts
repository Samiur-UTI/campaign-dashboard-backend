import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like } from 'typeorm';
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

  async searchCampaignsByName(
    projectId: number,
    searchTerm: string,
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;

    const [result, totalCount] = await this.campaignRepository.findAndCount({
      where: {
        project: { id: projectId },
        name: Like(`%${searchTerm}%`), // Search by name using wildcard
      },
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

  async findAllCampaignNamesByProjectId(projectId: number): Promise<string[]> {
    const campaigns = await this.campaignRepository.find({
      where: { project: { id: projectId } },
      select: ['name'], // Only select names
    });

    return campaigns.map((campaign) => campaign.name);
  }

  async fetchCampaignDetailsByNames(
    names: string[],
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;

    const [result, totalCount] = await this.campaignRepository.findAndCount({
      where: { name: In(names) },
      relations: ['project', 'leads', 'leads.connection'], // Load related data
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
