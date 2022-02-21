import { isThisWeek, format } from "date-fns";
import Project from "./Project";
import Task from "./Task";
import {
  updateTodayProjects,
  updateWeekProjects,
  checkComplete,
  findProjectData,
  removeProject,
  setComplete,
  findTaskData,
  editTaskData,
  getTodoList,
  removeTask,
  addProject,
  addTask,
} from "./Storage";

let selectedTask;

function changeSubHeading(id) {
  const subHeading = document.querySelector(".sub-heading");
  subHeading.textContent = id;
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

function deleteTask(listElement, elementName) {
  if (listElement) listElement.remove();
  removeTask(elementName);
}

function handleTaskIcons(e, task, listElement) {
  const id = e.target.id;
  const elementName = task.name;
  const element = e.target.parentNode.parentNode;
  const circleIcon = listElement.childNodes[0].firstChild;

  if (id === "edit") {
    selectedTask = elementName; // Saves todo element name so it can be looked up later
    displayTaskData(elementName);
  } else if (id === "info") {
    getTaskDetails(id, elementName);
  } else if (id === "delete") {
    deleteTask(element, elementName);
  } else {
    setComplete(elementName);
    isComplete(circleIcon, elementName);
  }
}

function displayTask(task) {
  const todoSection = document.querySelector(".todo-main");

  const todoList = document.querySelector(".todo-list");

  const listElement = document.createElement("li");
  listElement.classList.add("todo-item");
  listElement.addEventListener("click", (e) => {
    handleTaskIcons(e, task, listElement);
  });

  const leftPanel = document.createElement("div");
  leftPanel.classList.add("left-panel");

  const circle = document.createElement("i");
  circle.classList.add("far", "fa-circle");

  const taskName = document.createElement("p");
  taskName.classList.add("task-name");
  taskName.textContent = task.name;

  const rightPanel = document.createElement("div");
  rightPanel.classList.add("right-panel");

  const info = document.createElement("i");
  info.classList.add("fa-solid", "fa-circle-question", "todo-icon");
  info.id = "info";

  const edit = document.createElement("i");
  edit.classList.add("fas", "fa-edit", "todo-icon");
  edit.id = "edit";

  const remove = document.createElement("i");
  remove.classList.add("fa-solid", "fa-trash-can", "todo-icon");
  remove.id = "delete";

  rightPanel.appendChild(info);
  rightPanel.appendChild(edit);
  rightPanel.appendChild(remove);

  leftPanel.appendChild(circle);
  leftPanel.appendChild(taskName);

  listElement.appendChild(leftPanel);
  listElement.appendChild(rightPanel);

  todoList.appendChild(listElement);

  todoSection.appendChild(todoList);

  isComplete(listElement.childNodes[0].firstChild, task.name);
}

function removeElements(todo) {
  for (let i = 0; i < todo.length; i++) {
    todo[i].parentNode.removeChild(todo[i]);
  }
}

function filterTodo(id) {
  // Removes all todo elements and reconstructs them based on current filters
  const filter = id;
  const today = format(new Date(), "dd/MM/yyyy");
  const todoElement = document.querySelectorAll(".todo-item");

  updateWeekProjects("Inbox");
  updateTodayProjects("Inbox", today);
  removeElements(todoElement);

  getTodoList()
    .getProject(filter)
    .projects.forEach((project) => {
      displayTask(project);
    });
}

function projectPopupHandler(e) {
  const projectInput = document.querySelector(".project-input");

  const projectButton = document.querySelector(".project-button");
  projectButton.classList.toggle("hide");

  const projectPopup = document.querySelector(".project-popup");
  projectPopup.classList.toggle("hide");

  if (e.target.classList.contains("add")) createProject();

  if (e.target.classList.contains("cancel")) projectInput.value = "";
}

function navController(e) {
  if (e.target.classList.contains("nav-filter")) {
    changeSubHeading(e.target.id);
    filterTodo(e.target.id);
  } else if (e.target.classList.contains("project-button")) {
    projectPopupHandler(e);
  }
}

function toggleNav() {
  const nav = document.querySelector(".nav");

  nav.classList.toggle("show");
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

function editTask(newTask, filter) {
  modalDisplayController();
  editTaskData(newTask);
  filterTodo(filter);
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

function taskCreationHandler(filter, newTask) {
  addTask(filter, newTask);
  displayTask(newTask, filter);
  filterTodo(filter);
  resetModal();
  modalDisplayController();
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
  } else if (findTaskData("Inbox", newTask.name)) {
    alert("Task names must be different");
  } else {
    taskCreationHandler(filter, newTask);
  }
}

function modalEventsHandler(button) {
  if (button.textContent === "Add Task") {
    createTask();
  } else if (button.textContent === "Update Task") {
    // If updateTask, user is editing task and a new task will not be appended
    const updateTask = true;
    createTask(updateTask);
  } else if (button.id === "close-button") {
    modalDisplayController();
  }
}

function modalCloseCheck(e) {
  if (e.target.classList.contains("new-todo-text")) return;
  // Closes modal if modal content cannot be found when searching DOM tree
  if (!e.target.closest(".modal-content")) {
    modalDisplayController(e.target.id);
    if (e.target.id != "edit") {
      resetModal();
    }
  }
}

function initModal() {
  const newTodo = document.getElementById("new-todo");
  newTodo.addEventListener("click", (e) => {
    modalDisplayController(e.target.closest("button").id);
  });

  const modalContent = document.querySelectorAll(".modal-content");
  modalContent.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      modalEventsHandler(e.target);
    });
  });

  document.addEventListener("click", (e) => {
    modalCloseCheck(e);
  });
}

function loadTasks() {
  getTodoList()
    .getProject("Inbox")
    .projects.forEach((task) => {
      displayTask(task);
    });
}

function displayProject(project) {
  const projects = document.querySelector(".projects");
  const projectInput = document.querySelector(".project-input");

  const projectButton = document.createElement("button");
  projectButton.classList.add("new-project-button");
  projectButton.id = `${formatName(project.name)}`;
  projectButton.addEventListener("click", (e) => {
    changeSubHeading(e.target.closest("button").id);
    filterTodo(e.target.closest("button").id);
  });
  projectInput.value = "";

  const leftPanel = document.createElement("div");
  leftPanel.classList.add("left-panel");

  const projectName = document.createElement("span");
  projectName.textContent = formatName(project.name);

  const rightPanel = document.createElement("div");
  rightPanel.classList.add("right-panel");
  rightPanel.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-project")) {
      deleteProject(e);
    }
    e.stopPropagation();
  });

  const deleteButton = document.createElement("i");
  deleteButton.classList.add("fas", "fa-times", "delete-project", "hide");

  leftPanel.appendChild(projectName);

  rightPanel.appendChild(deleteButton);

  projectButton.appendChild(leftPanel);
  projectButton.appendChild(rightPanel);

  projects.insertBefore(
    projectButton,
    projects.childNodes[projects.childNodes.length - 4]
  );
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

function loadPage() {
  initNav();
  initModal();
  loadTasks();
  loadProjects();
}

function formatName(projectName) {
  return projectName
    .split(" ")
    .map((word) => {
      return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function createProject() {
  const projectInput = document.querySelector(".project-input");
  const project = formatName(projectInput.value);

  if (findProjectData(project)) {
    projectInput.value = "";
    return alert("Project names must be different");
  } else if (!projectInput.value) {
    return alert("Project names cannot be empty");
  }

  const newProject = new Project(project);

  addProject(newProject);
  displayProject(newProject);
}

function deleteProject(e) {
  const inbox = document.getElementById("Inbox");
  const projectButton = e.target.closest("button");

  projectButton.remove();
  removeProject(projectButton.id);
  inbox.click();
}

function checkWeek(task) {
  // Filter task by current week, clears date formatting so it can be parsed
  const week = isThisWeek(new Date(task.clearFormattedDate()), {
    weekStartsOn: 1,
  });
  return week;
}

export { loadPage, checkWeek, selectedTask };
