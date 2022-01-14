export default class Project {
  constructor(name) {
    this.name = name;
    this.projects = [];
  }

  getTasks() {
    return this.projects;
  }

  setTasks(projects) {
    this.projects = projects;
  }

  addTask(newTask) {
    this.projects.push(newTask);
  }

  findTask(name) {
    return this.projects.find((task) => task.name === name);
  }

  findTaskIndex(name) {
    return this.projects.findIndex((task) => task.name === name);
  }
}
