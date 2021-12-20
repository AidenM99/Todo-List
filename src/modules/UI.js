import Task from "./CreateTask";

export default function initialiseUI() {
  initSidebar();
  initModal();
}

const tasks = [];

function initSidebar() {
  const sidebarItems = document.querySelectorAll(".sidebar-item");

  sidebarItems.forEach((item) => {
    item.addEventListener("click", () => {
      const subHeading = document.querySelector(".sub-heading");

      subHeading.textContent = item.textContent;
    });
  });
}

function initModal() {
  const newTodo = document.querySelector(".new-todo");
  newTodo.addEventListener("click", openModal);

  const closeButton = document.querySelector(".close-button");
  closeButton.addEventListener("click", closeModal);

  const addTask = document.querySelector(".add-task");
  addTask.addEventListener("click", createTask);

  document.addEventListener("click", (event) => {
    if (
      !event.target.closest(".modal-content") &&
      !event.target.classList.contains("new-todo") &&
      !event.target.classList.contains("add-task")
    ) {
      closeModal();
    }
  });
}

function openModal() {
  const modal = document.querySelector(".modal-bg");

  modal.style.display = "flex";
}

function closeModal() {
  const modal = document.querySelector(".modal-bg");

  modal.style.display = "none";
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

  const addTask = new Task(task, description, date, priority);

  const formatDate = addTask.formatDate();

  tasks.push(addTask);

  displayTask(task, description, formatDate, priority);
}

function displayTask(task, description, date, priority) {
  const todoSection = document.querySelector(".todo-main");

  const todoList = document.querySelector(".todo-list");

  const listElement = document.createElement("li");
  listElement.classList.add("todo-item");

  const leftPanel = document.createElement("div");
  leftPanel.innerHTML = `<i class="far fa-circle"></i> ${task}`;

  const rightPanel = document.createElement("div");
  rightPanel.innerHTML = date + priority;

  listElement.appendChild(leftPanel);
  listElement.appendChild(rightPanel);
  todoList.appendChild(listElement);
  todoSection.appendChild(todoList);
}
