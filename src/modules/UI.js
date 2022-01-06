import Task from "./Task";
import { format, isThisWeek } from "date-fns";

export default function initialiseUI() {
  initSidebar();
  initModal();
}

const tasks = [];

let currentTask;

function initSidebar() {
  const sidebarItems = document.querySelectorAll(".sidebar-item");

  sidebarItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      const id = e.target.id;
      changeSubHeading(id);
      filterTodo(id);
    });
  });
}

function initModal() {
  const newTodo = document.getElementById("new-todo");
  newTodo.addEventListener("click", (e) => {
    const id = e.target.id;
    modalDisplayController(id);
  });

  const modalButton = document.querySelector(".modal-button");
  modalButton.addEventListener("click", (e) => {
    if (e.target.textContent === "Add Task") {
      createTask();
    } else {
      const newTask = createTask(e);
      editTask(newTask, getClickedTask(currentTask));
    }
  });
}

function changeSubHeading(sidebarItem) {
  const subHeading = document.querySelector(".sub-heading");
  subHeading.textContent = sidebarItem;
}

function filterTodo(id) {
  const filter = id;
  const today = format(new Date(), "dd/MM/yyyy");

  for (let i = 0; i < tasks.length; i++) {
    const todoElement = document.querySelectorAll(".todo-item");
    const getTaskDate = new Date(
      tasks[i].retrieveYear(),
      tasks[i].retrieveMonth() - 1,
      tasks[i].retrieveDate()
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

document.addEventListener("click", (e) => {
  if (
    !e.target.closest(".modal-content") &&
    !e.target.classList.contains(".modal-button") &&
    e.target.id != "new-todo" &&
    e.target.id != "edit" &&
    e.target.id != "info"
  ) {
    modalDisplayController();
    resetModal();
  }
});

function modalDisplayController(id) {
  const modalHeading = document.querySelector(".modal-heading");
  const modalButton = document.querySelector(".modal-button");
  const todoModal = document.getElementById("todo-modal");
  const infoModal = document.getElementById("info-modal");
  const addProject = document.getElementById("add-project ");

  switch (id) {
    case "new-todo":
      todoModal.style.display = "flex";
      modalHeading.textContent = "New Todo";
      modalButton.textContent = "Add Task";
      break;
    case "edit":
      todoModal.style.display = "flex";
      modalHeading.textContent = "Edit Todo";
      modalButton.textContent = "Update Task";
      break;
    case "add-project":
      break;
    case "info":
      infoModal.style.display = "flex";
      break;
    default:
      infoModal.style.display = "none";
      todoModal.style.display = "none";
  }
}

function resetModal() {
  const modalFields = document.querySelectorAll(".modal-field");

  for (let i = 0; i < modalFields.length; i++) {
    if (i === 3) {
      modalFields[i].value = "Low";
      continue;
    }
    modalFields[i].value = "";
  }
}

function createTask(e) {
  const taskField = document.getElementById("task");
  const taskVal = taskField.value;

  const descField = document.getElementById("description");
  const descVal = descField.value;

  const dateField = document.getElementById("due-date");
  const dateVal = dateField.value;

  const priorityField = document.getElementById("priority");
  const priorityVal = priorityField.value;

  if (!taskVal || !descVal || !dateVal)
    return alert("All fields must be filled");

  const newTask = new Task(taskVal, descVal, dateVal, priorityVal);

  const formatDate = newTask.formatDate();

  newTask.dueDate = formatDate;

  tasks.push(newTask);

  if (e) return newTask;

  displayTask(taskVal, formatDate, priorityVal);
  resetModal();
}

function displayTask(task, date, priority) {
  const todoSection = document.querySelector(".todo-main");

  const todoList = document.querySelector(".todo-list");

  const listElement = document.createElement("li");
  listElement.classList.add("todo-item");
  listElement.addEventListener("click", (e) => {
    const id = e.target.id;
    const targetNode = e.target.parentNode.parentNode;
    const taskName = listElement.childNodes[0].textContent;

    handleTaskIcons(id, targetNode, taskName);
  });

  const leftPanel = document.createElement("div");
  leftPanel.classList.add("left-panel");
  leftPanel.innerHTML = `<i class="far fa-circle"></i><p class="task-name">${task}</p>`;

  const rightPanel = document.createElement("div");
  rightPanel.classList.add("right-panel");
  rightPanel.innerHTML = `<p class="date-text">${date}</p>
  <p class="priority-text">${priority}</p>
  </i><i class="fas fa-edit todo-icon" id="edit"></i><i class="fas fa-info todo-icon" id="info"></i><i class="fas fa-trash todo-icon" id="delete">`;

  listElement.appendChild(leftPanel);
  listElement.appendChild(rightPanel);
  todoList.appendChild(listElement);
  todoSection.appendChild(todoList);
}

function handleTaskIcons(id, targetNode, taskName) {
  if (id === "edit") {
    currentTask = taskName;
    modalDisplayController(id);
    getTaskData(getClickedTask(taskName));
  } else if (id === "info") {
    getTaskDescription(getClickedTask(taskName));
    modalDisplayController(id);
  } else if (id === "delete") {
    deleteTask(getClickedTask(taskName), targetNode);
  }
}

function getClickedTask(taskName) {
  return tasks.findIndex((task) => task.task === taskName);
}

function getTaskDescription(clickedTask) {
  const info = document.querySelector(".info");
  info.textContent = tasks[clickedTask].description;
}

function deleteTask(clickedTask, targetNode) {
  if (targetNode) targetNode.remove();
  tasks.splice(clickedTask, 1);
}

function getTaskData(clickedTask) {
  const modalFields = document.querySelectorAll(".modal-field");

  for (let i = 0; i < modalFields.length; i++) {
    const modalFieldId = modalFields[i].id;

    if (i === 2) {
      modalFields[i].value = tasks[clickedTask].clearFormattedDate();
      continue;
    }
    modalFields[i].value = tasks[clickedTask][modalFieldId];
  }
}

function editTask(newTask, currentTask) {
  const taskName = document.querySelectorAll(".task-name");
  const dateText = document.querySelectorAll(".date-text");
  const priorityText = document.querySelectorAll(".priority-text");

  taskName[currentTask].textContent = newTask.task;
  dateText[currentTask].textContent = newTask.dueDate;
  priorityText[currentTask].textContent = newTask.priority;

  tasks[currentTask] = newTask;

  deleteTask(tasks.length - 1);
  resetModal();
}
