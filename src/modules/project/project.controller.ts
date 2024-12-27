import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guard/jwt-auth.guard';
import { ProjectsService } from './project.service';
import { CreateProjectDto } from '../common/dto/createProjectDto';
import { UpdateProjectDto } from '../common/dto/updateProjectDto';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    const userId = req.user.id;
    return this.projectsService.create(createProjectDto, userId);
  }

  @Get()
  async findAll(@Request() req) {
    const userId = req.user.id;
    return this.projectsService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.projectsService.remove(id);
  }
}
