import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Project } from './project.entity';
import { Lead } from './leads.entity';
export enum CampaignStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, (project) => project.id, { eager: true })
  project: Project;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.INACTIVE,
  })
  status: CampaignStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Lead, (lead) => lead.campaign)
  leads: Lead[];
}
