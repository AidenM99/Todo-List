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

  formatName() {
    return this.name
      .split(" ")
      .map((word) => {
        return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  }
}
