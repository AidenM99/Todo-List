import { format, isThisWeek } from "date-fns";
import { modalDisplayController, getTaskData, displayTask } from "./UI";
import {
  getTodoList,
  removeTask,
  updateTodayProjects,
  updateWeekProjects,
} from "./Storage";
import Project from "./Project";

class TodoList {
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
}

function filterTodo(id) {
  const filter = id;
  const today = format(new Date(), "dd/MM/yyyy");
  const todoElement = document.querySelectorAll(".todo-item");
  updateTodayProjects(today);
  updateWeekProjects();
  removeElements(todoElement);

  getTodoList()
    .getProject(filter)
    .projects.forEach((project) => {
      displayTask(project);
    });
}

function removeElements(todo) {
  for (let i = 0; i < todo.length; i++) {
    todo[i].parentNode.removeChild(todo[i]);
  }
}

function handleTaskIcons(iconID, targetNode, targetTask) {
  if (iconID === "edit") {
    taskIndex.set(targetTask);
    modalDisplayController(iconID);
    getTaskData(targetTask);
  } else if (iconID === "info") {
    modalDisplayController(iconID);
    getTaskDescription(targetTask);
  } else if (iconID === "delete") {
    deleteTask(targetTask, targetNode);
  }
}

const taskIndex = new getTargetTask();

function getTargetTask() {
  var task;
  return {
    get: function () {
      return task;
    },
    set: function (val) {
      task = val;
    },
  };
}

function deleteTask(taskIndex, targetNode) {
  if (targetNode) targetNode.remove();
  removeTask(taskIndex);
}

function getClickedTask(taskName) {
  return getTodoList().findIndex((task) => task.name === taskName);
}

function getTaskDescription(clickedTask) {
  const info = document.querySelector(".info");
  info.textContent = getTodoList()[clickedTask].description;
}

function checkWeek(project) {
  const week = isThisWeek(new Date(project.clearFormattedDate()), {
    weekStartsOn: 1,
  });
  return week;
}

export {
  filterTodo,
  handleTaskIcons,
  getClickedTask,
  deleteTask,
  taskIndex,
  TodoList,
  checkWeek,
};
