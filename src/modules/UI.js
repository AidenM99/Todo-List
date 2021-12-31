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

function changeSubHeading(id) {
  const subHeading = document.querySelector(".sub-heading");
  subHeading.textContent = id;
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

function initModal() {
  const newTodo = document.getElementById("new-todo");
  newTodo.addEventListener("click", (e) => {
    modalController(e.target.id);
  });
}

document.addEventListener("click", (event) => {
  if (
    !event.target.closest(".modal-content") &&
    !event.target.classList.contains(".modal-button") &&
    event.target.id != "new-todo" &&
    event.target.id != "edit" &&
    event.target.id != "info"
  ) {
    modalController();
  }
});

function modalController(id) {
  const modalHeading = document.querySelector(".modal-heading");
  const modalButton = document.querySelector(".modal-button");

  if (id === "new-todo") {
    document.getElementById("todo-modal").style.display = "flex";
    modalHeading.textContent = "New Todo";
    modalButton.textContent = "Add Task";
  } else if (id === "edit") {
    document.getElementById("todo-modal").style.display = "flex";
    modalHeading.textContent = "Edit Todo";
    modalButton.textContent = "Update Task";
  } else if (id === "info") {
    document.getElementById("info-modal").style.display = "flex";
  } else {
    document.getElementById("info-modal").style.display = "none";
    document.getElementById("todo-modal").style.display = "none";
  }
}

function resetModal(task, desc, date, priority) {
  task.value = "";
  desc.value = "";
  date.value = "";
  priority.value = "Low";
}

const modalButton = document.querySelector(".modal-button");
modalButton.addEventListener("click", checkModalFields);

function checkModalFields() {
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

  createTask(taskVal, descVal, dateVal, priorityVal);
  resetModal(taskField, descField, dateField, priorityField);
}

function createTask(task, desc, date, priority) {
  const newTask = new Task(task, desc, date, priority);

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
    modalController(id);
    retrieveTaskData(getClickedTask(taskName));
  } else if (id === "info") {
    getTaskDescription(getClickedTask(taskName));
    modalController(id);
  } else if (id === "delete") {
    deleteTask(targetNode, getClickedTask(taskName));
  }
}

function getClickedTask(taskName) {
  return tasks.findIndex((task) => task.task === taskName);
}

function getTaskDescription(clickedTask) {
  const info = document.querySelector(".info");
  info.textContent = tasks[clickedTask].description;
}

function deleteTask(targetNode, clickedTask) {
  targetNode.remove();
  tasks.splice(clickedTask, 1);
}

function retrieveTaskData(clickedTask) {
  const taskInput = document.getElementById("task");
  const descriptionInput = document.getElementById("description");
  const dateInput = document.getElementById("due-date");
  const priorityInput = document.getElementById("priority");

  taskInput.value = tasks[clickedTask].task;
  descriptionInput.value = tasks[clickedTask].description;
  dateInput.value = tasks[clickedTask].clearFormattedDate();
  priorityInput.value = tasks[clickedTask].priority;

  console.log(tasks[0])
}
