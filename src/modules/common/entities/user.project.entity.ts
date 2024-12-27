import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user_projects')
export class UserProject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number; // Foreign key to user

  @Column()
  projectId: number; // Foreign key to project
}
