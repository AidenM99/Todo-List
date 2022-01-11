import Task from "./Task";

export { getTodoList, saveTodoList, addTask, removeTask };

function saveTodoList(todoList) {
  localStorage.setItem("todoList", JSON.stringify(todoList));
}

function getTodoList() {
  if (localStorage.getItem("todoList")) {
    const todoList = JSON.parse(localStorage.getItem("todoList")).map((task) =>
      Object.assign(new Task(), task)
    );

    return todoList;
  } else {
    const todoList = [];

    return todoList;
  }
}

function addTask(newTask) {
  const todoList = getTodoList();
  todoList.push(newTask);
  saveTodoList(todoList);
}

function removeTask(taskIndex) {
  const todoList = getTodoList();
  todoList.splice(taskIndex, 1);
  saveTodoList(todoList);
}
