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

// Eventlisteners
projectForm.addEventListener("submit", addProject);
projectsList.addEventListener("change", selectProject);
deleteBtn.addEventListener("click", deleteProject);
todoForm.addEventListener("submit", addTodo);

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
  return { todoId: keyId, todoName: value };
}

// Display the available todos
function displaytodo(projectId) {
  let template = ``;
  if (todoAppData[projectId].todos.length > 0) {
    return todoAppData[projectId].todos.forEach((t) => {
      template = template.concat(`<div class="d-flex justify-content-between m-1 mt-3">
    <p class="text-white text-size">${t.todoName}</p>
    <div id=${t.todoId} class="buttons">
    <button class="btn btn-sm btn-outline-info edit-todo">Edit</button>
    <button class="btn btn-sm btn-outline-danger delete-todo">Delete</button>
    </div>
    </div>`);
      todosContainer.innerHTML = template;
      deleteTodo();
      editTodo();
    });
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
  todoInput.value = e.target.parentElement.previousElementSibling.innerHTML;
  let selectedTodoIndex = 0;
  todoAppData[selectedProjectId].todos.some((t, index) => {
    if (t.todoId == e.target.parentElement.getAttribute("id")) {
      selectedTodoIndex = index;
      todoAppData[selectedProjectId].todos.splice(selectedTodoIndex, 1);
      return true;
    }
  });
  displaytodo(selectedProjectId);
}
