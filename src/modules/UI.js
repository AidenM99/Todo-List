import Task from "./Task";
import { saveTodoList, getTodoList, addTask } from "./Storage";
import {
  filterTodo,
  handleTaskIcons,
  currentTask,
  deleteTask,
  getClickedTask,
} from "./Todo";

export { loadPage, modalDisplayController, getTaskData, displayTask };

function loadPage() {
  initSidebar();
  initModal();
  loadTasks();
}

function initSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.addEventListener("click", (e) => {
    if (e.target.classList.contains("sidebar-item")) {
      changeSubHeading(e.target.id);
      filterTodo(e.target.id);
    } else if (e.target.classList.contains("project-button")) {
      projectPopupHandler();
    }
  });
}

function projectPopupHandler() {
  const projectButton = document.querySelector(".project-button");
  const projectPopup = document.querySelector(".project-popup");
  projectButton.classList.toggle("hide");
  projectPopup.classList.toggle("hide");
  if (e.target.classList.contains(".add")) createProject();
}

function initModal() {
  const newTodo = document.getElementById("new-todo");
  newTodo.addEventListener("click", (e) => {
    modalDisplayController(e.target.id);
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

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".modal-content")) {
      modalDisplayController(e.target.id);
      if (e.target.id != "edit") {
        resetModal();
      }
    }
  });
}

function changeSubHeading(id) {
  const subHeading = document.querySelector(".sub-heading");
  subHeading.textContent = id;
}

function modalDisplayController(id) {
  const modalHeading = document.querySelector(".modal-heading");
  const modalButton = document.querySelector(".modal-button");
  const todoModal = document.getElementById("todo-modal");
  const infoModal = document.getElementById("info-modal");

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

function loadTasks() {
  getTodoList().forEach((task) => {
    displayTask(task.name, task.dueDate, task.priority);
  });
}

function createTask(e) {
  const taskVal = document.getElementById("name").value;
  const descVal = document.getElementById("description").value;
  const dateVal = document.getElementById("due-date").value;
  const priorityVal = document.getElementById("priority").value;
  const currentFilter = document.querySelector(".sub-heading").textContent;

  if (!taskVal || !descVal || !dateVal) {
    return alert("All fields must be filled");
  }

  const newTask = new Task(taskVal, descVal, dateVal, priorityVal);

  const formatDate = newTask.formatDate();

  newTask.dueDate = formatDate;

  addTask(newTask);

  if (e) return newTask;

  displayTask(taskVal, formatDate, priorityVal);
  filterTodo(currentFilter);
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
  <i class="fas fa-edit todo-icon" id="edit"></i><i class="fas fa-info todo-icon" id="info"></i><i class="fas fa-trash todo-icon" id="delete"></i>
  `;

  listElement.appendChild(leftPanel);
  listElement.appendChild(rightPanel);
  todoList.appendChild(listElement);
  todoSection.appendChild(todoList);
}

function getTaskData(clickedTask) {
  const modalFields = document.querySelectorAll(".modal-field");

  for (let i = 0; i < modalFields.length; i++) {
    const modalFieldId = modalFields[i].id;

    if (i === 2) {
      modalFields[i].value = getTodoList()[clickedTask].clearFormattedDate();
      continue;
    }
    modalFields[i].value = getTodoList()[clickedTask][modalFieldId];
  }
}

function editTask(newTask, currentTask) {
  const taskName = document.querySelectorAll(".task-name");
  const dateText = document.querySelectorAll(".date-text");
  const priorityText = document.querySelectorAll(".priority-text");

  taskName[currentTask].textContent = newTask.name;
  dateText[currentTask].textContent = newTask.dueDate;
  priorityText[currentTask].textContent = newTask.priority;

  getTodoList()[currentTask] = newTask;

  deleteTask(getTodoList().length - 1);
  resetModal();
}
