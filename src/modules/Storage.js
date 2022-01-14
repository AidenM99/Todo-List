import Task from "./Task";
import Project from "./Project";
import { TodoList, checkWeek, selectedTask } from "./Todo";

function saveTodoList(todoList) {
  localStorage.setItem("todoList", JSON.stringify(todoList));
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

function addProject(newProject) {
  const todoList = getTodoList();
  todoList.addProject(newProject);
  saveTodoList(todoList);
}

function addTask(projectName, newTask) {
  const todoList = getTodoList();
  if (projectName !== "Inbox") {
    todoList.getProject("Inbox").addTask(newTask);
  }
  todoList.getProject(projectName).addTask(newTask);
  saveTodoList(todoList);
}

function removeTask(elementName) {
  let todoList = getTodoList();
  todoList.getProjects().forEach((project) => {
    project.setTasks(
      project.getTasks().filter((task) => task.name != elementName)
    );
  });
  saveTodoList(todoList);
}

function findTaskDescription(elementName) {
  const todoList = getTodoList();
  return todoList.getProject("Inbox").findTask(elementName).getDescription();
}

function findTaskData(elementName) {
  const todoList = getTodoList();
  return todoList.getProject("Inbox").findTask(elementName);
}

function editTaskData(task) {
  const todoList = getTodoList();
  todoList.getProjects().forEach((project) => {
    if (project.findTask(selectedTask.get())) {
      project.findTask(selectedTask.get()).setData(task);
    }
  });
  saveTodoList(todoList);
}

function updateTodayProjects(today) {
  const todoList = getTodoList();
  const filterToday = todoList
    .getProject("Inbox")
    .getTasks()
    .filter((project) => project.dueDate === today);
  todoList.getProject("Today").projects = filterToday.slice(0);
  saveTodoList(todoList);
  return filterToday;
}

function updateWeekProjects() {
  const todoList = getTodoList();
  const filterWeek = todoList
    .getProject("Inbox")
    .getTasks()
    .filter((project) => checkWeek(project));
  todoList.getProject("Week").projects = filterWeek.slice(0);
  saveTodoList(todoList);
  return filterWeek;
}

export {
  getTodoList,
  saveTodoList,
  addTask,
  removeTask,
  addProject,
  updateTodayProjects,
  updateWeekProjects,
  findTaskDescription,
  findTaskData,
  editTaskData,
};
