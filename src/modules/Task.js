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

  getDay() {
    return this.dueDate.slice(0, 2);
  }

  getMonth() {
    return this.dueDate.slice(3, 5);
  }

  getYear() {
    return this.dueDate.slice(6, 10);
  }
}
