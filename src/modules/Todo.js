import { format, isThisWeek } from "date-fns";
import { modalDisplayController, getTaskData } from "./UI";
import { getTodoList, removeTask } from "./Storage";

export { filterTodo, handleTaskIcons, getClickedTask, deleteTask, currentTask };

let currentTask;

function filterTodo(id) {
  const filter = id;
  const today = format(new Date(), "dd/MM/yyyy");

  for (let i = 0; i < getTodoList().length; i++) {
    const todoElement = document.querySelectorAll(".todo-item");
    const getTaskDate = new Date(
      getTodoList()[i].getYear(),
      getTodoList()[i].getMonth() - 1,
      getTodoList()[i].getDay()
    );

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

function handleTaskIcons(id, targetNode, taskName) {
  if (id === "edit") {
    currentTask = taskName;
    modalDisplayController(id);
    getTaskData(getClickedTask(taskName));
  } else if (id === "info") {
    modalDisplayController(id);
    getTaskDescription(getClickedTask(taskName));
  } else if (id === "delete") {
    deleteTask(getClickedTask(taskName), targetNode);
  }
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
