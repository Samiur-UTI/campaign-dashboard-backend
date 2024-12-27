import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { Campaign } from 'src/modules/common/entities/campaign.entity';
import { Connection } from 'src/modules/common/entities/connection.entity';
import { Lead } from 'src/modules/common/entities/leads.entity';
import { Profile } from 'src/modules/common/entities/profile.entity';
import { Project } from 'src/modules/common/entities/project.entity';
import { User } from 'src/modules/common/entities/user.entity';
import { UserProject } from 'src/modules/common/entities/user.project.entity';

config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +process.env.DB_PORT || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, Profile, Project, UserProject, Campaign, Lead, Connection],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: true,
  logging: true,
};
