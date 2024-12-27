import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  campaignId: number; // Foreign key to campaign

  @Column()
  address: string;

  @Column()
  type: string;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
