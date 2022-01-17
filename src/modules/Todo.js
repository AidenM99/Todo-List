import Project from "./Project";

export default class TodoList {
  constructor() {
    this.projects = [];
    this.projects.push(new Project("Inbox"));
    this.projects.push(new Project("Today"));
    this.projects.push(new Project("Week"));
  }

  setProjects(projects) {
    this.projects = projects;
  }

  getProjects() {
    return this.projects;
  }

  getProject(projectName) {
    return this.projects.find((project) => project.name === projectName);
  }

  addProject(newProject) {
    this.projects.push(newProject);
  }

  deleteProject(projectName) {
    const projectIndex = this.projects.findIndex(
      (project) => project.name === projectName
    );
    this.projects.splice(projectIndex, 1);
  }
}
