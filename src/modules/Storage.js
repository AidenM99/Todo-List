import Task from "./Task";
import Project from "./Project";
import { TodoList, checkWeek } from "./Todo";

function savetodoList(todoList) {
  localStorage.setItem("todoList", JSON.stringify(todoList));
}

function saveProjects(projects) {
  localStorage.setItem("projects", JSON.stringify(projects));
}

function getTodoList() {
  const todoList = Object.assign(
    new TodoList(),
    JSON.parse(localStorage.getItem("todoList"))
  );

  todoList.setProjects(
    todoList
      .getProjects()
      .map((project) => Object.assign(new Project(), project))
  );

  todoList.getProjects().forEach((project) => {
    project.setTasks(
      project.getTasks(project).map((task) => Object.assign(new Task(), task))
    );
  });

  return todoList;
}

function addTask(projectName, newTask) {
  const todoList = getTodoList();
  if (projectName === "Today" || projectName === "Week") projectName = "Inbox";
  todoList.getProject(projectName).addTask(newTask);
  savetodoList(todoList);
}

function removeTask(taskIndex) {
  const todoList = getTodoList();
  todoList.splice(taskIndex, 1);
  savetodoList(todoList);
}

function editTodo(newTask, currentTask) {
  const todoList = getTodoList();
  todoList[currentTask] = newTask;
  savetodoList(todoList);
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

function updateTodayProjects(today) {
  const todoList = getTodoList();
  const filterToday = todoList
    .getProject("Inbox")
    .getTasks()
    .filter((project) => project.dueDate === today);
  todoList.getProject("Today").projects = filterToday.slice(0);
  savetodoList(todoList);
  return filterToday;
}

function updateWeekProjects() {
  const todoList = getTodoList();
  const filterWeek = todoList
    .getProject("Inbox")
    .getTasks()
    .filter((project) => checkWeek(project));
  todoList.getProject("Week").projects = filterWeek.slice(0);
  savetodoList(todoList);
  return filterWeek;
}

export {
  getTodoList,
  savetodoList,
  addTask,
  removeTask,
  editTodo,
  addProject,
  addTaskToProject,
  updateTodayProjects,
  updateWeekProjects,
};
