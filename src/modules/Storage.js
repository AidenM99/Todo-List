import { displayTask } from "./UI";
import Task from "./Task";

export { getTodoList, saveTodoList, tasks };

let tasks;

function saveTodoList() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTodoList() {
  if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks")).map(
      (task) =>
        new Task(task.name, task.description, task.dueDate, task.priority)
    );
    tasks.forEach((task) => {
      displayTask(task.name, task.dueDate, task.priority);
    });
  } else {
    tasks = [];
  }
}
