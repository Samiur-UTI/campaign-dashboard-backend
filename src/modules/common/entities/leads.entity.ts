import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Campaign } from './campaign.entity';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Campaign, (campaign) => campaign.id, { eager: true })
  campaign: Campaign;

  @Column()
  address: string;

  @Column()
  type: string;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
