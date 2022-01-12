import Task from "./Task";
import Project from "./Project";
import {
  getTasks,
  addTask,
  editTodo,
  addProject,
  addTaskToProject,
} from "./Storage";
import {
  filterTodo,
  handleTaskIcons,
  deleteTask,
  getClickedTask,
  taskIndex,
} from "./Todo";

function loadPage() {
  initSidebar();
  initModal();
  loadTasks();
}

function loadTasks() {
  getTasks().forEach((task) => {
    displayTask(task);
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

function modalEventsHandler(targetText) {
  if (targetText === "Add Task") {
    createTask();
  } else {
    const updateTask = true;
    const newTask = createTask(updateTask);
    editTask(newTask);
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
  const filter = document.querySelector(".sub-heading").textContent;

  if (!name || !desc || !date) {
    return alert("All fields must be filled");
  }

  const newTask = new Task(name, desc, date, priority);
  newTask.dueDate = newTask.formatDate();

  addTask(newTask);

  if (filter !== "Inbox" || filter !== "Today" || filter !== "Week") {
    addTaskToProject(newTask, filter);
  }

  if (updateTask) return newTask;

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
    const targetNode = e.target.parentNode.parentNode;
    const taskName = getClickedTask(listElement.childNodes[0].textContent);
    handleTaskIcons(id, targetNode, taskName);
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
}

function getTaskData(clickedTask) {
  const modalFields = document.querySelectorAll(".modal-field");

  for (let i = 0; i < modalFields.length; i++) {
    const modalFieldId = modalFields[i].id;

    if (i === 2) {
      modalFields[i].value = getTasks()[clickedTask].clearFormattedDate();
      continue;
    }

    modalFields[i].value = getTasks()[clickedTask][modalFieldId];
  }
}

function editTask(newTask) {
  const index = taskIndex.get();
  const taskName = document.querySelectorAll(".task-name");
  const dateText = document.querySelectorAll(".date-text");
  const priorityText = document.querySelectorAll(".priority-text");

  taskName[index].textContent = newTask.name;
  dateText[index].textContent = newTask.dueDate;
  priorityText[index].textContent = newTask.priority;

  editTodo(newTask, index);
  deleteTask(getTasks().length - 1);
  resetModal();
}

function createProject() {
  const projectName = document.querySelector(".project-input").value;

  const newProject = new Project(projectName);

  addProject(newProject);
  displayProject();
}

function displayProject() {
  const projects = document.querySelector(".projects");
  const projectInput = document.querySelector(".project-input");

  const projectButton = document.createElement("button");
  projectButton.classList.add("new-project-button");
  projectButton.textContent = projectInput.value;
  projectButton.id = projectInput.value;
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

export { loadPage, modalDisplayController, getTaskData, displayTask };
