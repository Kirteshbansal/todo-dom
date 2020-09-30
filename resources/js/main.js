let todoAppData = {};
let selectedProjectId;
let selectedProjectName;
let selectedTodoId;

// Query selecters
const projectForm = document.getElementById("project-form");
const projectInput = document.getElementById("project-input");
const projectsList = document.getElementById("projects-list");
const deleteBtn = document.getElementById("project-delete-btn");
const todoSection = document.getElementById("todo-container");
const projectTitle = document.getElementById("project-todo-list");
const todosContainer = document.getElementById("todos");
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const filterTodos = document.getElementById("filter-completed-todos");
const showCompletedTodos = document.getElementById("show-comp-todo");
const UpdateTodo = document.getElementById("todo-update");
const saveUpdate = document.getElementById("save-changes");

// Eventlisteners
projectForm.addEventListener("submit", addProject);
projectsList.addEventListener("change", selectProject);
deleteBtn.addEventListener("click", deleteProject);
todoForm.addEventListener("submit", addTodo);
filterTodos.addEventListener("click", filterCompletedTodos);
// functions
// Add a project into data
function addProject(e) {
  e.preventDefault();
  const projectName = projectInput.value;
  let projectsNames = projectPresence(projectName);
  if (projectName == "" || projectName == null) {
    alert(`Please enter a valid project name.`);
  } else if (projectsNames.indexOf(projectName) !== -1) {
    alert(`A project with same name already exists.`);
  } else {
    const newProject = createProject(projectName);
    projectInput.value = null;
    todoAppData[newProject[0]] = newProject[1];
    displayProject(newProject[0], newProject[1]);
  }
}

// Create a new Project
function createProject(projectName) {
  return [Date.now().toString(), { projectName: projectName, todos: [] }];
}

// Check Project's Avaibility
function projectPresence(projectName) {
  return Object.values(todoAppData)
    .filter((p) => p.projectName == projectName)
    .map((p) => p.projectName);
}

// Add project into select list
function displayProject(key, value) {
  const projectElement = document.createElement("option");
  projectElement.setAttribute("value", value.projectName);
  projectElement.dataset.projectId = key;
  projectElement.classList.add("project-element");
  projectElement.innerHTML = value.projectName;
  projectsList.appendChild(projectElement);
}

// Select a project
function selectProject(e) {
  selectedProjectId =
    projectsList.options[projectsList.selectedIndex].dataset.projectId;
  selectedProjectName =
    projectsList.options[projectsList.selectedIndex].innerHTML;
  projectTitle.innerHTML = selectedProjectName;
  displaytodo(selectedProjectId);
}

// Delete selected project
function deleteProject(e) {
  if (selectedProjectId != null && selectedProjectName != null) {
    alert(`${selectedProjectName} project is deleted.`);
    delete todoAppData[selectedProjectId];
    delete todoAppData[selectedProjectName];
    projectsList.removeChild(projectsList.options[projectsList.selectedIndex]);
    projectTitle.innerHTML = "Not selected";
    todosContainer.innerHTML = "";
  }
}

// Add a todo to selected project
function addTodo(e) {
  e.preventDefault();
  if (selectedProjectName && selectedProjectId) {
    if (todoInput.value != "" && todoInput.value != null) {
      const todo = createTodo(todoInput.value);
      todoAppData[selectedProjectId].todos.push(todo);
      displaytodo(selectedProjectId);
      todoInput.value = null;
    } else {
      alert(`Please enter a valid todo name.`);
    }
  } else {
    alert("Select a project first.");
  }
}

// Create a todo
function createTodo(value) {
  let keyId = Date.now().toString();
  return { todoId: keyId, todoName: value, completed: false };
}

// Display the available todos
function displaytodo(projectId) {
  if (todoAppData[projectId].todos.length > 0) {
    showcaseTodos(todoAppData[projectId].todos);
  } else {
    todosContainer.innerHTML = "";
  }
}

//  Delete a todo
function deleteTodo() {
  document
    .querySelectorAll(".delete-todo")
    .forEach((b) => b.addEventListener("click", deleteSelectedTodo));
}

// Supportive function to delete a todo
function deleteSelectedTodo(e) {
  let selectedTodoIndex = 0;
  todoAppData[selectedProjectId].todos.some((t, index) => {
    if (t.todoId == e.target.parentElement.getAttribute("id")) {
      alert(`${t.todoName} todo is deleted.`);
      selectedTodoIndex = index;
      todoAppData[selectedProjectId].todos.splice(selectedTodoIndex, 1);
      return true;
    }
  });
  displaytodo(selectedProjectId);
}

// Edit a todo
function editTodo() {
  document
    .querySelectorAll(".edit-todo")
    .forEach((b) => b.addEventListener("click", editSelectedTodo));
}

//  Supportive function to edit a todo
function editSelectedTodo(e) {
  selectedTodoId = e.target.parentElement.getAttribute("id");
  UpdateTodo.value = e.target.parentElement.previousElementSibling.innerHTML;
  saveUpdate.addEventListener("click", (e) => {
    const newTodoValue = UpdateTodo.value;
    todoAppData[selectedProjectId].todos.forEach((t) => {
      if (t.todoId === selectedTodoId) {
        t.todoName = newTodoValue;
        displaytodo(selectedProjectId);
      }
    });
  });
}

// Mark a todo complete
function completeTodo() {
  document
    .querySelectorAll(".done-todo")
    .forEach((b) => b.addEventListener("click", markCompleted));
}

// Suppotive function to mark a todo complete
function markCompleted(e) {
  const todoId = e.target.parentElement.getAttribute("id");
  const todo = todoAppData[selectedProjectId].todos.filter(
    (e) => e.todoId === todoId
  )[0];
  if (!todo.completed) {
    todo.completed = true;
    e.target.innerHTML = "Undone";
  } else {
    todo.completed = false;
    e.target.innerHTML = "Done";
  }
}

function filterCompletedTodos() {
  const completedTodos = todoAppData[selectedProjectId].todos.filter(
    (t) => t.completed
  );

  if (filterTodos.checked) {
    if (completedTodos.length > 0) {
      showcaseTodos(completedTodos);
      showCompletedTodos.innerHTML = "Show All Todos";
    } else {
      todosContainer.innerHTML = "";
      showCompletedTodos.innerHTML = "Show All Todos";
    }
  } else {
    displaytodo(selectedProjectId);
    showCompletedTodos.innerHTML = "Show Completed Todos";
  }
}

function showcaseTodos(data) {
  let template = ``;
  return data.forEach((t) => {
    let status = t.completed === true ? "Undone" : "Done";
    template = template.concat(`<div class="d-flex justify-content-between align-items-center m-1 mt-2 border border-info rounded p-2">
        <p class="text-white text-size m-0">${t.todoName}</p>
        <div id=${t.todoId} class="buttons">
        <button class="btn btn-sm btn-outline-success done-todo">${status}</button>
        <button type="button" class="btn btn-sm btn-outline-info edit-todo" data-toggle="modal" data-target="#exampleModalCenter">Edit</button>
        <button class="btn btn-sm btn-outline-danger delete-todo">Delete</button>
        </div>
        </div>`);
    todosContainer.innerHTML = template;
    completeTodo();
    deleteTodo();
    editTodo();
  });
}
