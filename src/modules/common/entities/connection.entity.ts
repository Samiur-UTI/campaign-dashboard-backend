import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Lead } from './leads.entity';

@Entity('connections')
export class Connection {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lead, (lead) => lead.id)
  lead: Lead;

  @Column()
  name: string;

  @Column({ type: 'json', nullable: true })
  metaTags: object;

  @Column({ nullable: true })
  lastActive: Date;
}
