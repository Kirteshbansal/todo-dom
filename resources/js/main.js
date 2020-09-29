let todoAppData = {};
let selectedProjectId;
let selectedProjectName;

// Query selecters
const projectForm = document.getElementById("project-form");
const projectInput = document.getElementById("project-input");
const projectsList = document.getElementById("projects-list");
const deleteBtn = document.getElementById("project-delete-btn");

// Eventlisteners
projectForm.addEventListener("submit", addProject);
projectsList.addEventListener("change", selectProject);
deleteBtn.addEventListener("click", deleteProject);

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
