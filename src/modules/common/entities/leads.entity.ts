import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Campaign } from './campaign.entity';
import { Connection } from './connection.entity';

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

  @OneToMany(() => Connection, (connection) => connection.lead)
  connection: Connection[];
}
