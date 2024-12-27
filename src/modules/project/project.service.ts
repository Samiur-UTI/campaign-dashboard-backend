import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Project } from '../common/entities/project.entity';
import { UserProject } from '../common/entities/user.project.entity';
import { CreateProjectDto } from '../common/dto/createProjectDto';
import { UpdateProjectDto } from '../common/dto/updateProjectDto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(UserProject)
    private userProjectRepository: Repository<UserProject>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    userId: number,
  ): Promise<Project> {
    const newProject = this.projectRepository.create(createProjectDto);
    const savedProject = await this.projectRepository.save(newProject);

    const userProject = this.userProjectRepository.create({
      user: { id: userId },
      project: savedProject,
    });

    await this.userProjectRepository.save(userProject);

    return savedProject;
  }

  async findAll(userId: number): Promise<Project[]> {
    const userProjects = await this.userProjectRepository.find({
      where: { user: { id: userId } },
      relations: ['project'],
    });

    if (!userProjects || userProjects.length === 0) {
      return [];
    }

    const projectIds = userProjects.map(
      (userProject) => userProject.project.id,
    );

    const projects = await this.projectRepository.findBy({
      id: In(projectIds),
    });

    return projects;
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, updateProjectDto);
    return await this.projectRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);

    await this.userProjectRepository.delete({ project: { id } });
  }
}
