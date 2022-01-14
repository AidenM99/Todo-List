export default class Task {
  constructor(name, description, dueDate, priority) {
    this.name = name;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
  }

  formatDate() {
    const modifyDate = this.dueDate.replaceAll("-", "/");
    return modifyDate.split("/").reverse().join("/");
  }

  clearFormattedDate() {
    const modifyDate = this.dueDate.replaceAll("/", "-");
    return modifyDate.split("-").reverse().join("-");
  }

  getDescription() {
    return this.description;
  }

  setData(task) {
    this.name = task.name;
    this.description = task.description;
    this.dueDate = task.dueDate;
    this.priority = task.priority;
  }
}
