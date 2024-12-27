import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('connections')
export class Connection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  leadId: number;
  @Column()
  name: string;

  @Column({ type: 'json', nullable: true })
  metaTags: object;

  @Column({ nullable: true })
  lastActive: Date;
}
