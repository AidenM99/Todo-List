import { format, isThisWeek } from "date-fns";
import { getTaskData, displayTask, getTaskDetails, isComplete } from "./UI";
import {
  getTodoList,
  removeTask,
  updateTodayProjects,
  updateWeekProjects,
  setComplete,
} from "./Storage";

function filterTodo(id) {
  const filter = id;
  const today = format(new Date(), "dd/MM/yyyy");
  const todoElement = document.querySelectorAll(".todo-item");

  updateWeekProjects("Inbox");
  updateTodayProjects("Inbox", today);
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

function handleTaskIcons(iconID, listElement, circleIcon, elementName) {
  if (iconID === "edit") {
    selectedTask.set(elementName);
    getTaskData(elementName);
  } else if (iconID === "info") {
    getTaskDetails(iconID, elementName);
  } else if (iconID === "delete") {
    deleteTask(listElement, elementName);
  } else {
    setComplete(elementName);
    isComplete(circleIcon, elementName);
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

export { filterTodo, handleTaskIcons, deleteTask, checkWeek, selectedTask };
