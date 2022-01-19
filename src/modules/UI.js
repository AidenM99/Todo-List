import Project from "./Project";
import Task from "./Task";
import {
  checkComplete,
  findProjectData,
  removeProject,
  findTaskData,
  editTaskData,
  getTodoList,
  removeTask,
  addProject,
  addTask,
} from "./Storage";
import {
  modalEventsHandler,
  modalCloseCheck,
  handleTaskIcons,
  navController,
  mqController,
  checkMedia,
  filterTodo,
} from "./app";

function loadPage() {
  initNav();
  initModal();
  initMedia();
  loadTasks();
  loadProjects();
}

function initNav() {
  const nav = document.querySelector(".nav");
  nav.addEventListener("click", (e) => {
    navController(e);
  });

  const openNav = document.querySelector(".open-nav");
  openNav.addEventListener("click", () => {
    toggleNav();
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
    modalCloseCheck(e);
  });
}

function initMedia() {
  const mq = window.matchMedia("(max-width: 990px)");
  const filter = document.querySelector(".sub-heading").textContent;
  mqController(mq, filter);
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

function changeSubHeading(id) {
  const subHeading = document.querySelector(".sub-heading");
  subHeading.textContent = id;
}

function removeElements(todo) {
  for (let i = 0; i < todo.length; i++) {
    todo[i].parentNode.removeChild(todo[i]);
  }
}

function toggleNav() {
  const nav = document.querySelector(".nav");

  nav.classList.toggle("show");
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
  const filter = document.querySelector(".sub-heading").textContent;
  const isComplete = false;

  if (!name || !desc || !date) {
    return alert("All fields must be filled");
  }

  const newTask = new Task(name, desc, date, priority, isComplete);
  newTask.dueDate = newTask.formatDate();

  if (updateTask) {
    editTask(newTask, filter);
    return;
  } else if (findTaskData("Inbox", newTask.name)) {
    alert("Task names must be different");
    return;
  }

  addTask(filter, newTask);
  displayTask(newTask, filter);
  filterTodo(filter);
  resetModal();
}

function editTask(newTask, filter) {
  modalDisplayController();
  editTaskData(newTask);
  filterTodo(filter);
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
    const elementName = task.name;
    handleTaskIcons(id, element, circleIcon, elementName);
  });

  const leftPanel = document.createElement("div");
  leftPanel.classList.add("left-panel");
  leftPanel.innerHTML = `<i class="far fa-circle"></i><p class="task-name">${checkMedia(
    task.name
  )}</p>`;

  const rightPanel = document.createElement("div");
  rightPanel.classList.add("right-panel");
  rightPanel.innerHTML = `
  <button id="info" class="task-details-button">Details</button>
  <i class="fas fa-edit todo-icon" id="edit"></i>
  <i class="fas fa-trash todo-icon" id="delete"></i>
  `;

  listElement.appendChild(leftPanel);
  listElement.appendChild(rightPanel);
  todoList.appendChild(listElement);
  todoSection.appendChild(todoList);

  isComplete(listElement.childNodes[0].firstChild, task.name);
}

function getTaskDetails(id, elementName) {
  const taskDetails = document.querySelector(".task-details");
  taskDetails.innerHTML = `
  <span class="task-key">Name:</span><p class="task-prop">${
    findTaskData("Inbox", elementName).name
  }</p> 
  <span class="task-key">Details:</span><p class="task-prop">${
    findTaskData("Inbox", elementName).description
  }</p> 
  <span class="task-key">Priority:</span><p class="task-prop">${
    findTaskData("Inbox", elementName).priority
  }</p> 
  <span class="task-key">Due Date:</span><p class="task-prop">${
    findTaskData("Inbox", elementName).dueDate
  }</p> 
  `;
  modalDisplayController(id);
}

function displayTaskData(elementName, id) {
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

function deleteTask(listElement, elementName) {
  if (listElement) listElement.remove();
  removeTask(elementName);
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

function projectPopupHandler(e) {
  const projectButton = document.querySelector(".project-button");
  const projectPopup = document.querySelector(".project-popup");
  const projectInput = document.querySelector(".project-input");
  projectButton.classList.toggle("hide");
  projectPopup.classList.toggle("hide");
  if (e.target.classList.contains("add")) createProject();
  if (e.target.classList.contains("cancel")) projectInput.value = "";
}

function createProject() {
  const projectName = document.querySelector(".project-input").value;
  const projectInput = document.querySelector(".project-input");

  if (projectName.length > 40) {
    return alert("Project name cannot exceed 40 characters");
  } else if (findProjectData(projectName)) {
    projectInput.value = "";
    return alert("Project names must be different");
  }

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
  projectButton.id = project.name;
  projectInput.value = "";

  const leftProjectPanel = document.createElement("div");
  leftProjectPanel.classList.add("left-panel");
  leftProjectPanel.innerHTML = `<span>${project.name}</span>`;

  const rightProjectPanel = document.createElement("div");
  rightProjectPanel.classList.add("right-panel");
  rightProjectPanel.innerHTML = `<i class="fas fa-times delete-project hide"></i>`;

  rightProjectPanel.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-project")) {
      const projectButton = e.target.closest("button");
      deleteProject(projectButton);
    }
    e.stopPropagation();
  });

  projectButton.addEventListener("click", (e) => {
    changeSubHeading(e.target.closest("button").id);
    filterTodo(e.target.closest("button").id);
  });

  projectButton.appendChild(leftProjectPanel);
  projectButton.appendChild(rightProjectPanel);
  projects.insertBefore(
    projectButton,
    projects.childNodes[projects.childNodes.length - 4]
  );
}

function deleteProject(projectButton) {
  const inbox = document.getElementById("Inbox");
  projectButton.remove();
  removeProject(projectButton.id);
  inbox.click();
}

export {
  modalDisplayController,
  projectPopupHandler,
  changeSubHeading,
  removeElements,
  displayTaskData,
  getTaskDetails,
  isComplete,
  displayTask,
  resetModal,
  createTask,
  deleteTask,
  initMedia,
  loadPage,
};
