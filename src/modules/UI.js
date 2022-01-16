import Task from "./Task";
import Project from "./Project";
import {
  getTodoList,
  addTask,
  addProject,
  findTaskDescription,
  findTaskData,
  editTaskData,
  checkComplete,
} from "./Storage";
import { filterTodo, handleTaskIcons } from "./app";

function loadPage() {
  initSidebar();
  initModal();
  loadTasks();
  loadProjects();
}

function loadTasks() {
  getTodoList()
    .getProject("Inbox")
    .projects.forEach((task) => {
      displayTask(task);
    });
}

function loadProjects() {
  getTodoList()
    .getProjects()
    .forEach((project) => {
      if (
        project.name === "Inbox" ||
        project.name === "Today" ||
        project.name === "Week"
      )
        return;
      displayProject(project);
    });
}

function initSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.addEventListener("click", (e) => {
    if (e.target.classList.contains("sidebar-item")) {
      changeSubHeading(e.target.id);
      filterTodo(e.target.id);
    } else if (e.target.classList.contains("project-button")) {
      projectPopupHandler(e);
    }
  });
}

function initModal() {
  const newTodo = document.getElementById("new-todo");
  newTodo.addEventListener("click", (e) => {
    modalDisplayController(e.target.id);
  });

  const modalButton = document.querySelector(".modal-button");
  modalButton.addEventListener("click", (e) => {
    modalEventsHandler(e.target.textContent);
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

function projectPopupHandler(e) {
  const projectButton = document.querySelector(".project-button");
  const projectPopup = document.querySelector(".project-popup");
  projectButton.classList.toggle("hide");
  projectPopup.classList.toggle("hide");
  if (e.target.classList.contains("add")) createProject();
}

function modalEventsHandler(buttonText) {
  if (buttonText === "Add Task") {
    createTask();
  } else {
    const updateTask = true;
    createTask(updateTask);
  }
}

function modalDisplayController(id) {
  const modalHeading = document.querySelector(".modal-heading");
  const modalButton = document.querySelector(".modal-button");
  const todoModal = document.getElementById("todo-modal");
  const infoModal = document.getElementById("info-modal");

  if (id === "new-todo") {
    todoModal.style.display = "flex";
    modalHeading.textContent = "New Todo";
    modalButton.textContent = "Add Task";
  } else if (id === "edit") {
    todoModal.style.display = "flex";
    modalHeading.textContent = "Edit Todo";
    modalButton.textContent = "Update Task";
  } else if (id === "info") {
    infoModal.style.display = "flex";
  } else {
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

function createTask(updateTask) {
  const name = document.getElementById("name").value;
  const desc = document.getElementById("description").value;
  const date = document.getElementById("due-date").value;
  const priority = document.getElementById("priority").value;
  const isComplete = false;
  const filter = document.querySelector(".sub-heading").textContent;

  if (!name || !desc || !date) {
    return alert("All fields must be filled");
  }

  const newTask = new Task(name, desc, date, priority, isComplete);
  newTask.dueDate = newTask.formatDate();

  if (updateTask) {
    editTaskData(newTask);
    filterTodo(filter);
    return;
  }

  addTask(filter, newTask);
  displayTask(newTask);
  filterTodo(filter);
  resetModal();
}

function displayTask(task) {
  const todoSection = document.querySelector(".todo-main");

  const todoList = document.querySelector(".todo-list");

  const listElement = document.createElement("li");
  listElement.classList.add("todo-item");
  listElement.addEventListener("click", (e) => {
    const id = e.target.id;
    const element = e.target.parentNode.parentNode;
    const circleIcon = listElement.childNodes[0].firstChild;
    const elementName = listElement.childNodes[0].textContent;
    handleTaskIcons(id, element, circleIcon, elementName);
  });

  const leftPanel = document.createElement("div");
  leftPanel.classList.add("left-panel");
  leftPanel.innerHTML = `<i class="far fa-circle"></i><p class="task-name">${task.name}</p>`;

  const rightPanel = document.createElement("div");
  rightPanel.classList.add("right-panel");
  rightPanel.innerHTML = `<p class="date-text">${task.dueDate}</p>
  <p class="priority-text">${task.priority}</p>
  <i class="fas fa-edit todo-icon" id="edit"></i><i class="fas fa-info todo-icon" id="info"></i><i class="fas fa-trash todo-icon" id="delete"></i>
  `;

  listElement.appendChild(leftPanel);
  listElement.appendChild(rightPanel);
  todoList.appendChild(listElement);
  todoSection.appendChild(todoList);

  isComplete(
    listElement.childNodes[0].firstChild,
    listElement.childNodes[0].textContent
  );
}

function getTaskData(elementName, id) {
  const modalFields = document.querySelectorAll(".modal-field");
  const taskData = findTaskData("Inbox", elementName);

  for (let i = 0; i < modalFields.length; i++) {
    const modalFieldId = modalFields[i].id;

    if (i === 2) {
      modalFields[i].value = taskData.clearFormattedDate();
      continue;
    }

    modalFields[i].value = taskData[modalFieldId];
  }

  modalDisplayController(id);
}

function createProject() {
  const projectName = document.querySelector(".project-input").value;

  const newProject = new Project(projectName);

  addProject(newProject);
  displayProject(newProject);
  filterTodo(projectName);
}

function displayProject(project) {
  const projects = document.querySelector(".projects");
  const projectInput = document.querySelector(".project-input");

  const projectButton = document.createElement("button");
  projectButton.classList.add("new-project-button");
  projectButton.textContent = project.name;
  projectButton.id = project.name;
  projectInput.value = "";

  projectButton.addEventListener("click", (e) => {
    changeSubHeading(e.target.id);
    filterTodo(e.target.id);
  });

  projects.insertBefore(
    projectButton,
    projects.childNodes[projects.childNodes.length - 4]
  );
}

function isComplete(circleIcon, elementName) {
  if (checkComplete("Inbox", elementName)) {
    circleIcon.removeAttribute("class");
    circleIcon.classList.add("fas", "fa-check-circle");
    circleIcon.nextSibling.style.setProperty("text-decoration", "line-through");
  } else {
    circleIcon.removeAttribute("class");
    circleIcon.classList.add("far", "fa-circle");
    circleIcon.nextSibling.style.removeProperty(
      "text-decoration",
      "line-through"
    );
  }
}

function getTaskDescription(id, elementName) {
  const info = document.querySelector(".info");
  info.textContent = findTaskDescription("Inbox", elementName);
  modalDisplayController(id);
}

export {
  loadPage,
  modalDisplayController,
  getTaskData,
  displayTask,
  getTaskDescription,
  isComplete,
};
