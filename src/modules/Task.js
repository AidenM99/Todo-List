import { isThisWeek } from "date-fns";

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

  checkWeek() {
    // Filter task by current week, clears date formatting so it can be parsed
    return isThisWeek(new Date(this.clearFormattedDate()), {
      weekStartsOn: 1,
    });
  }
}
