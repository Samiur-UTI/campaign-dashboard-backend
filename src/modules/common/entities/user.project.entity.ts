import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Project } from './project.entity';
import { User } from './user.entity';

@Entity('user_projects')
export class UserProject {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  user: User;

  @ManyToOne(() => Project, (project) => project.id, { eager: true })
  project: Project;
}
