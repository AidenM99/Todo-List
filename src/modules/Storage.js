import Task from "./Task";
import Project from "./Project";

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveProjects(projects) {
  localStorage.setItem("projects", JSON.stringify(projects));
}

function getTasks() {
  if (localStorage.getItem("tasks")) {
    const tasks = JSON.parse(localStorage.getItem("tasks")).map((task) =>
      Object.assign(new Task(), task)
    );

    return tasks;
  } else {
    const tasks = [];

    return tasks;
  }
}

function getProjects() {
  if (localStorage.getItem("projects")) {
    const projects = JSON.parse(localStorage.getItem("projects")).map(
      (project) => Object.assign(new Project(), project)
    );

    return projects;
  } else {
    const projects = [];

    return projects;
  }
}

function addTask(newTask) {
  const tasks = getTasks();
  tasks.push(newTask);
  saveTasks(tasks);
}

function removeTask(taskIndex) {
  const tasks = getTasks();
  tasks.splice(taskIndex, 1);
  saveTasks(tasks);
}

function editTodo(newTask, currentTask) {
  const tasks = getTasks();
  tasks[currentTask] = newTask;
  saveTasks(tasks);
}

function addProject(newProject) {
  const projects = getProjects();
  projects.push(newProject);
  saveProjects(projects);
}

function addTaskToProject(newTask, projectName) {
  const projects = getProjects();
  const project = projects.find((project) => project.name === projectName);
  project.projects.push(newTask);
}

export {
  getTasks,
  saveTasks,
  addTask,
  removeTask,
  editTodo,
  addProject,
  addTaskToProject,
};
