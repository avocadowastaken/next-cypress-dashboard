export interface Project {
  projectId: string;
}

export class ProjectModel {
  private projects = new Map<string, Project>();

  async findSingle(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async ensureProject(id: string): Promise<Project> {
    let project = await this.findSingle(id);

    if (!project) {
      project = { projectId: id };
      await this.createSingle(project);
    }

    return project;
  }

  async createSingle(values: Project): Promise<Project> {
    this.projects.set(values.projectId, values);

    return values;
  }
}
