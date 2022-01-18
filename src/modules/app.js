import { isThisWeek, format } from "date-fns";
import {
  modalDisplayController,
  projectPopupHandler,
  changeSubHeading,
  removeElements,
  displayTaskData,
  getTaskDetails,
  displayTask,
  isComplete,
  resetModal,
  createTask,
  deleteTask,
} from "./UI";
import {
  updateTodayProjects,
  updateWeekProjects,
  setComplete,
  getTodoList,
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

function handleTaskIcons(iconID, listElement, circleIcon, elementName) {
  if (iconID === "edit") {
    selectedTask.set(elementName);
    displayTaskData(elementName);
  } else if (iconID === "info") {
    getTaskDetails(iconID, elementName);
  } else if (iconID === "delete") {
    deleteTask(listElement, elementName);
  } else {
    setComplete(elementName);
    isComplete(circleIcon, elementName);
  }
}

function checkWeek(project) {
  const week = isThisWeek(new Date(project.clearFormattedDate()), {
    weekStartsOn: 1,
  });
  return week;
}

function navController(e) {
  if (e.target.classList.contains("nav-filter")) {
    changeSubHeading(e.target.id);
    filterTodo(e.target.id);
  } else if (e.target.classList.contains("project-button")) {
    projectPopupHandler(e);
  }
}

function modalCloseCheck(e) {
  if (!e.target.closest(".modal-content")) {
    modalDisplayController(e.target.id);
    if (e.target.id != "edit") {
      resetModal();
    }
  }
}

function modalEventsHandler(buttonText) {
  if (buttonText === "Add Task") {
    createTask();
  } else {
    const updateTask = true;
    createTask(updateTask);
  }
}

function mqController(mq, filter) {
  mq.onchange = (e) => {
    if (e.matches) {
      filterTodo(filter);
    } else {
      filterTodo(filter);
    }
  };
}

function checkMedia(string) {
  const mq = window.matchMedia("(max-width: 990px)");

  if (mq.matches && string.length > 25) {
    // If media query matches
    return (string = string.substring(0, 20) + "...");
  } else {
    return string;
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

export {
  modalEventsHandler,
  modalCloseCheck,
  handleTaskIcons,
  navController,
  mqController,
  checkMedia,
  checkWeek,
  deleteTask,
  filterTodo,
  selectedTask,
};
