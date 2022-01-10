function filterTodo(id) {
    const filter = id;
    const today = format(new Date(), "dd/MM/yyyy");
    const projectIndex = getClickedProject(id);
  
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
      } else if (
        projectIndex != -1 &&
        projects[projectIndex].projectTasks.length != 0
      ) {
        projects[projectIndex].projectTasks.forEach((task) => {
          if (tasks[i].name === task.name) {
            todoElement[i].style.display = "flex";
          } else {
            todoElement[i].style.display = "none";
          }
        });
      } else {
        todoElement[i].style.display = "none";
      }
    }
  }

  function getClickedProject(projectId) {
    return projects.findIndex((project) => project.name === projectId);
  }

  function createTask(e) {
    const taskVal = document.getElementById("name").value;
    const descVal = document.getElementById("description").value;
    const dateVal = document.getElementById("due-date").value;
    const priorityVal = document.getElementById("priority").value;
    const currentFilter = document.querySelector(".sub-heading").textContent;
    const currentProject = getClickedProject(currentFilter);
  
    if (!taskVal || !descVal || !dateVal)
      return alert("All fields must be filled");
  
    const newTask = new Task(taskVal, descVal, dateVal, priorityVal);
  
    const formatDate = newTask.formatDate();
  
    newTask.dueDate = formatDate;
  
    tasks.push(newTask);
  
    if (currentProject != -1) {
      projects[currentProject].projectTasks.push(newTask);
    }
  
    if (e) return newTask;
  
    displayTask(taskVal, formatDate, priorityVal);
    filterTodo(currentFilter);
    resetModal();
  }

  function createProject() {
    const projectName = document.querySelector(".project-input").value;
  
    const newProject = new Project(projectName);
  
    projects.push(newProject);
  
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
      filterTodo(e.target.id);
    });
  
    projects.insertBefore(
      projectButton,
      projects.childNodes[projects.childNodes.length - 4]
    );
  }

  const projects = []