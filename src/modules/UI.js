import Task from "./CreateTask";
import { format, isThisWeek } from "date-fns";

export default function initialiseUI() {
  initSidebar();
  initModal();
}

const tasks = [];

function initSidebar() {
  const sidebarItems = document.querySelectorAll(".sidebar-item");

  sidebarItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      changeSubHeading(e.target.id);
      filterTodo(e.target.id);
    });
  });
}

function changeSubHeading(sidebarItem) {
  const subHeading = document.querySelector(".sub-heading");
  subHeading.textContent = sidebarItem;
}

function initModal() {
  const newTodo = document.querySelector(".new-todo");
  newTodo.addEventListener("click", (e) => {
    openModal(e.target);
  });

  const closeButton = document.querySelectorAll(".close-button");
  closeButton.forEach((button) => {
    button.addEventListener("click", () => {
      closeModal();
    });
  });

  const addTask = document.querySelector(".add-task");
  addTask.addEventListener("click", createTask);

  document.addEventListener("click", (event) => {
    if (
      !event.target.closest(".modal-content") &&
      !event.target.classList.contains("new-todo") &&
      !event.target.classList.contains("add-task") &&
      event.target.id != "info"
    ) {
      closeModal();
    }
  });
}

function openModal(button) {
  const Todomodal = document.getElementById("todo-modal");
  const Infomodal = document.getElementById("info-modal");

  if (button.classList.contains("new-todo"))
    return (Todomodal.style.display = "flex");
  Infomodal.style.display = "flex";
}

function closeModal() {
  const Todomodal = document.getElementById("todo-modal");
  const Infomodal = document.getElementById("info-modal");

  Todomodal.style.display = "none";
  Infomodal.style.display = "none";
}

function resetModal(task, description, date, priority) {
  task.value = "";
  description.value = "";
  date.value = "";
  priority.value = "Low";
}

function createTask() {
  const taskInput = document.getElementById("task");
  const task = taskInput.value;

  const descriptionInput = document.getElementById("description");
  const description = descriptionInput.value;

  const dateInput = document.getElementById("due-date");
  const date = dateInput.value;

  const priorityInput = document.getElementById("priority");
  const priority = priorityInput.value;

  if (!task || !description || !date) return alert("All fields must be filled");

  const newTask = new Task(task, description, date, priority);

  resetModal(taskInput, descriptionInput, dateInput, priorityInput);

  const formattedDate = newTask.formatDate();

  newTask.dueDate = formattedDate;

  tasks.push(newTask);

  displayTask(task, formattedDate, priority);
}

function displayTask(task, date, priority) {
  const todoSection = document.querySelector(".todo-main");

  const todoList = document.querySelector(".todo-list");

  const listElement = document.createElement("li");
  listElement.classList.add("todo-item");
  listElement.addEventListener("click", (e) => {
    const id = e.target.id;
    if (id === "edit") {
    } else if (id === "info") {
      const taskName = listElement.childNodes[0].textContent;
      getClickedTask(taskName);
      openModal(e.target);
    } else if (id === "delete") {
    }
  });

  const leftPanel = document.createElement("div");
  leftPanel.classList.add("left-panel");
  leftPanel.innerHTML = `<i class="far fa-circle"></i>${task}`;

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

function getClickedTask(taskName) {
  const clickedTask = tasks.findIndex((task) => task.task === taskName);
  getTaskDescription(clickedTask);
}

function getTaskDescription(clickedTask) {
  const info = document.querySelector(".info");
  info.textContent = tasks[clickedTask].description;
}
