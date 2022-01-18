import { checkWeek, selectedTask } from "./app";
import Project from "./Project";
import TodoList from "./Todo";
import Task from "./Task";

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
  const todoList = getTodoList();
  todoList.getProjects().forEach((project) => {
    project.setTasks(
      project.getTasks().filter((task) => task.name != elementName)
    );
  });
  saveTodoList(todoList);
}

function removeProject(projectName) {
  const todoList = getTodoList();
  todoList.getProject("Inbox").setTasks(
    todoList
      .getProject("Inbox")
      .getTasks()
      .filter(
        (task) =>
          !todoList
            .getProject(projectName)
            .getTasks()
            .some((task2) => task.name === task2.name)
      )
  );
  todoList.deleteProject(projectName);
  saveTodoList(todoList);
}

function findTaskData(projectName, elementName) {
  const todoList = getTodoList();
  return todoList.getProject(projectName).findTask(elementName);
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

function setComplete(elementName) {
  const todoList = getTodoList();
  todoList.getProjects().forEach((project) => {
    if (project.findTask(elementName)) {
      project.findTask(elementName).setComplete();
    }
  });
  saveTodoList(todoList);
}

function checkComplete(projectName, elementName) {
  const todoList = getTodoList();
  return todoList.getProject(projectName).findTask(elementName).getIsComplete();
}

function updateTodayProjects(projectName, today) {
  const todoList = getTodoList();
  todoList.getProject("Today").setTasks(
    todoList
      .getProject(projectName)
      .getTasks()
      .filter((project) => project.dueDate === today)
  );
  saveTodoList(todoList);
  return todoList;
}

function updateWeekProjects(projectName) {
  const todoList = getTodoList();
  todoList.getProject("Week").setTasks(
    todoList
      .getProject(projectName)
      .getTasks()
      .filter((project) => checkWeek(project))
  );
  saveTodoList(todoList);
  return todoList;
}

export {
  updateTodayProjects,
  updateWeekProjects,
  checkComplete,
  removeProject,
  saveTodoList,
  getTodoList,
  removeTask,
  findTaskData,
  editTaskData,
  setComplete,
  addProject,
  addTask,
};
