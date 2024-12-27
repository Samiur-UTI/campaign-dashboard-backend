import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../common/entities/project.entity';
import { UserProject } from '../common/entities/user.project.entity';
import { ProjectsController } from './project.controller';
import { ProjectsService } from './project.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, UserProject]), // Register entities
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
