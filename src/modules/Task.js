export default class Task {
  constructor(name, description, dueDate, priority, isComplete) {
    this.name = name;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.isComplete = isComplete;
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

  getIsComplete() {
    return this.isComplete;
  }

  setComplete() {
    this.isComplete === false
      ? (this.isComplete = true)
      : (this.isComplete = false);
  }

  setData(task) {
    this.name = task.name;
    this.description = task.description;
    this.dueDate = task.dueDate;
    this.priority = task.priority;
  }
}
