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

  retrieveDate() {
    const date = this.dueDate.slice(0, 2);
    return date;
  }

  retrieveMonth() {
    const month = this.dueDate.slice(3, 5);
    return month;
  }

  retrieveYear() {
    const year = this.dueDate.slice(6, 10);
    return year;
  }
}
