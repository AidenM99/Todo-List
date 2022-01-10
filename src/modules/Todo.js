import { format, isThisWeek } from "date-fns";
import { tasks, modalDisplayController, getTaskData } from "./UI";

export { filterTodo, handleTaskIcons, getClickedTask, deleteTask, currentTask };

let currentTask;

function filterTodo(id) {
  const filter = id;
  const today = format(new Date(), "dd/MM/yyyy");

  for (let i = 0; i < tasks.length; i++) {
    const todoElement = document.querySelectorAll(".todo-item");
    const getTaskDate = new Date(
      tasks[i].getYear(),
      tasks[i].getMonth() - 1,
      tasks[i].getDay()
    );

    if (filter === "Inbox") {
      todoElement[i].style.display = "flex";
    } else if (filter === "Today" && tasks[i].dueDate === today) {
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

function deleteTask(clickedTask, targetNode) {
  if (targetNode) targetNode.remove();
  tasks.splice(clickedTask, 1);
}

function getClickedTask(taskName) {
  return tasks.findIndex((task) => task.name === taskName);
}

function getTaskDescription(clickedTask) {
  const info = document.querySelector(".info");
  info.textContent = tasks[clickedTask].description;
}
