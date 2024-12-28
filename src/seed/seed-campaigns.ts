import { DataSource } from 'typeorm';
import {
  Campaign,
  CampaignStatus,
} from '../modules/common/entities/campaign.entity';
import { Project } from '../modules/common/entities/project.entity';
import { config } from 'dotenv';
import { Lead } from '../modules/common/entities/leads.entity';
import { Connection } from '../modules/common/entities/connection.entity';

// Load environment variables from .env file
config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +process.env.DB_PORT || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Campaign, Project, Lead, Connection],
  synchronize: false,
});

const generateCampaigns = async () => {
  // Connect to the database
  await AppDataSource.initialize();

  const projectRepository = AppDataSource.getRepository(Project);
  const campaignRepository = AppDataSource.getRepository(Campaign);

  // Fetch existing projects
  const projects = await projectRepository.find();
  if (projects.length === 0) {
    console.error(
      'No existing projects found. Please create projects before seeding campaigns.',
    );
    await AppDataSource.destroy();
    return; // Exit if no projects are present
  }

  // Create 100 campaigns with unique names
  const campaigns: Campaign[] = [];
  for (let i = 1; i <= 100; i++) {
    const campaign = new Campaign();
    campaign.name = `Unique Campaign ${i} - ${Math.random().toString(36).substring(7)}`; // Unique campaign name
    campaign.status = CampaignStatus.INACTIVE; // Default to INACTIVE
    // Randomly select a project ID
    campaign.project = projects[Math.floor(Math.random() * projects.length)]; // Assign a random project
    campaigns.push(campaign);
  }

  // Save all campaigns in a single batch
  await campaignRepository.save(campaigns);
  console.log('Campaigns seeded successfully:', campaigns.length);

  // Close the connection
  await AppDataSource.destroy();
};

// Execute the seeder function
generateCampaigns().catch((err) => {
  console.error('Error during seeding campaigns:', err);
  process.exit(1);
});
