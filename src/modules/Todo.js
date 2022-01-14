import { format, isThisWeek } from "date-fns";
import { getTaskData, displayTask, getTaskDescription } from "./UI";
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

  addProject(newProject) {
    this.projects.push(newProject);
  }
}

function filterTodo(id) {
  const filter = id;
  const today = format(new Date(), "dd/MM/yyyy");
  const todoElement = document.querySelectorAll(".todo-item");

  updateWeekProjects();
  updateTodayProjects(today);
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

function handleTaskIcons(iconID, listElement, elementName) {
  if (iconID === "edit") {
    selectedTask.set(elementName);
    getTaskData(elementName);
  } else if (iconID === "info") {
    getTaskDescription(iconID, elementName);
  } else if (iconID === "delete") {
    deleteTask(listElement, elementName);
  }
}

const selectedTask = new getTargetTask();

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

function deleteTask(listElement, elementName) {
  if (listElement) listElement.remove();
  removeTask(elementName);
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
  deleteTask,
  selectedTask,
  TodoList,
  checkWeek,
};
