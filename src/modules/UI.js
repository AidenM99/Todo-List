import Task from "./Task";
import Project from "./Project";
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

  const projectButton = document.querySelector(".project-button");
  const projectPopup = document.querySelector(".project-popup");
  const addProject = document.querySelector(".add");
  const cancel = document.querySelector(".cancel");

  projectButton.addEventListener("click", () => {
    projectButton.classList.toggle("hide");
    projectPopup.classList.toggle("hide");
  });

  addProject.addEventListener("click", () => {
    projectButton.classList.toggle("hide");
    projectPopup.classList.toggle("hide");
    createProject();
  });

  cancel.addEventListener("click", () => {
    projectButton.classList.toggle("hide");
    projectPopup.classList.toggle("hide");
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
    const buttonText = e.target.textContent
    if (buttonText === "Add Task") {
      createTask();
    } else {
      const newTask = createTask(buttonText);
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

function createTask(buttonText) {
  const taskVal = document.getElementById("name").value;

  const descVal = document.getElementById("description").value;

  const dateVal = document.getElementById("due-date").value;

  const priorityVal = document.getElementById("priority").value;

  const currentFilter = document.querySelector(".sub-heading").textContent;

  if (!taskVal || !descVal || !dateVal)
    return alert("All fields must be filled");

  const newTask = new Task(taskVal, descVal, dateVal, priorityVal);

  const formatDate = newTask.formatDate();

  newTask.dueDate = formatDate;

  tasks.push(newTask);

  if (buttonText === "Update Task") return newTask;

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
  return tasks.findIndex((task) => task.name === taskName);
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

  taskName[currentTask].textContent = newTask.name;
  dateText[currentTask].textContent = newTask.dueDate;
  priorityText[currentTask].textContent = newTask.priority;

  tasks[currentTask] = newTask;

  deleteTask(tasks.length - 1);
  resetModal();
}

function createProject() {
  const projectName = document.querySelector(".project-input").value;

  const newProject = new Project(projectName);

  displayProject();
}

function displayProject() {
  const projects = document.querySelector(".projects");
  const projectInput = document.querySelector(".project-input");

  const projectButton = document.createElement("button");
  projectButton.textContent = projectInput.value;
  projectButton.id = projectInput.value;
  projectButton.classList.add("project-button");
  projectInput.value = "";
  projectButton.addEventListener("click", (e) => {
    changeSubHeading(e.target.id);
  });

  projects.insertBefore(
    projectButton,
    projects.childNodes[projects.childNodes.length - 4]
  );
}
