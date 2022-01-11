import { format, isThisWeek } from "date-fns";
import { modalDisplayController, getTaskData } from "./UI";
import { getTodoList, removeTask } from "./Storage";

function filterTodo(id) {
  const filter = id;
  const today = format(new Date(), "dd/MM/yyyy");

  for (let i = 0; i < getTodoList().length; i++) {
    const todoElement = document.querySelectorAll(".todo-item");
    const getTaskDate = new Date(getTodoList()[i].clearFormattedDate());

    if (filter === "Inbox") {
      todoElement[i].style.display = "flex";
    } else if (filter === "Today" && getTodoList()[i].dueDate === today) {
      todoElement[i].style.display = "flex";
    } else if (
      filter === "Week" &&
      isThisWeek(getTaskDate, { weekStartsOn: 1 })
    ) {
      todoElement[i].style.display = "flex";
    } else {
      todoElement[i].style.display = "none";
    }
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

export { filterTodo, handleTaskIcons, getClickedTask, deleteTask, taskIndex };
