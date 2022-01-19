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
  // Removes all todo elements and reconstructs them based on current filters
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
    selectedTask.set(elementName); // Saves todo element name so it can be looked up later
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

function checkWeek(task) {
  // Filter task by current week, clears date formatting so it can be parsed
  const week = isThisWeek(new Date(task.clearFormattedDate()), {
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
  // Closes modal if modal content cannot be found when searching DOM tree
  if (!e.target.closest(".modal-content")) {
    modalDisplayController(e.target.id);
    if (e.target.id != "edit") {
      resetModal();
    }
  }
}

function modalEventsHandler(button) {
  if (button.textContent === "Add Task") {
    createTask();
  } else if (button.textContent === "Update Task") {
    // If updateTask, user is editing task and a new task will not be appended
    const updateTask = true;
    createTask(updateTask);
  } else if (button.id === "close-button") {
    modalDisplayController();
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
  checkWeek,
  deleteTask,
  filterTodo,
  selectedTask,
};
