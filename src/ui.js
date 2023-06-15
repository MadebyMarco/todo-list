import {
  project,
  todoItem,
  setProjectsContainerFromStorage,
  getIndexOfElementFromEvent,
  getCurrentItemFromEvent,
  projectsContainer,
  currentlySelectedProject,
  currentlySelectedTodoItem,
  setCurrentlySelectedProject,
  setCurrentlySelectedTodoItem,
  setCurrentTodoItemToFirstItemOfCurrentProject,
  addItemToCurrentlySelectedProject,
  isLast,
  getProjectsContainerFromStorage,
} from "./logic";
import { DOM } from "./dom";

function addEventListenerToBody() {
  document.body.addEventListener("click", handleClickOnBody);
}

function handleClickOnBody(event) {
  // switch (event.target) {
  //   case event.target.closest(checklistRemoveButton.selector):
  //     checklistRemoveButton.handler(event);
  //     break;
  // }

  executeHandler(
    [
      checklistRemoveButton,
      checklistAddButton,
      projectDiv,
      projectDivDeleteButton,
      todoItemLi,
      todoItemDeleteButton,
    ],
    event
  );
}

function clickEvent(selector, handler) {
  return { selector, handler };
}

function executeHandler(handlers = [], event) {
  handlers.forEach((element) => {
    if (event.target.closest(element.selector)) {
      element.handler(event);
    }
  });
}
//create a way that we can add new event listeners that have their own handler built in so I dont create a huge switch statement
//everytime I want to add a new event listener and its handler
const checklistRemoveButton = clickEvent(
  "li.checklistItem > button.remove",
  handleChecklistRemoveButtons
);

const checklistAddButton = clickEvent(
  "li.checklistItem > button.add",
  handleAddButtons
);

const projectDiv = clickEvent(
  "div.project > textarea",
  handleProjectDivOnClick
);

const projectDivDeleteButton = clickEvent(
  "div.project > button.deleteButton",
  handleDeleteButtonsForProjects
);

const todoItemLi = clickEvent(
  "ul.todoItems > li.todoItemListItem",
  handleTodoItemOnClick
);

const todoItemDeleteButton = clickEvent(
  "li.todoItemListItem > button.deleteButton",
  handleDeleteButtonsForTodoItems
);

function handleChecklistRemoveButtons(event) {
  const checklist = document.querySelector(".checklist");
  if (checklist.childElementCount != 1) {
    const checklistItem = event.target.parentNode;
    console.log(checklistItem);
    console.log(checklistItem.parentNode);
    // checklistItem used to be event.current.target.parentNode
    const itemForRemovalIndex = getIndexOfElementFromEvent(checklistItem);
    todoItem.checklist.removeItem(
      itemForRemovalIndex,
      currentlySelectedTodoItem
    );
    console.log(currentlySelectedProject);
    checklistItem.remove();
    setProjectsContainerFromStorage();
  } else console.error("Cant delete last checklist item");
}

function handleAddButtons() {
  const newChecklistItem = todoItem.checklist.createItem(
    "Create a checklist item here"
  );
  todoItem.checklist.addItem(newChecklistItem, currentlySelectedTodoItem);
  DOM.removeItemContentsfromDisplay();
  DOM.displayTodoItemContents(currentlySelectedTodoItem);
  setProjectsContainerFromStorage();
}

function handleProjectDivOnClick(event) {
  console.log(projectsContainer);
  setProjectsContainerFromStorage();
  const projectDiv = event.target.parentNode;
  // this solution below is more robust because I wont have to re Index everytime i clear projects.
  const index = getIndexOfElementFromEvent(projectDiv) - 1; //-1 because header is included in parent element
  setCurrentlySelectedProject(projectsContainer[index]);
  DOM.removeTodoItemsContainer();
  DOM.removeItemContentsfromDisplay();
  setCurrentTodoItemToFirstItemOfCurrentProject();
  DOM.displayTodoItems();
  DOM.displayFirstItemContent(currentlySelectedProject);
  DOM.updatePriorityIndicator();
  handleDeleteButtonsForProjects(event);
  DOM.removeCurrentlySelectedClassFromHolder(".currentlySelected.project");
  DOM.addCurrentlySelectedClass(event.target.closest("div.project"));
}

const _addEventListenersToProjects = () => {
  DOM.getProjectsOnDisplay().forEach((project) => {
    const projectTitleTextarea = project.childNodes[0];
    project.addEventListener(
      "dblclick",
      () => (projectTitleTextarea.readOnly = false)
    );

    project.addEventListener("focusout", () => {
      projectTitleTextarea.readOnly = true;
      currentlySelectedProject.title = projectTitleTextarea.value;
    });
  });
};

function handleDeleteButtonsForProjects(event) {
  if (event.target.classList.contains("deleteButton")) {
    if (isLast(DOM.getProjectsOnDisplay()) == true) {
      throw Error("Cant delete last project");
    }
    const projectDiv = event.target.closest("div.project");
    const index = getIndexOfElementFromEvent(event.target.parentNode) - 1; //-1 because header is included in parent element
    project.removeFromProjectsContainer(projectsContainer[index]);
    setProjectsContainerFromStorage();
    setCurrentlySelectedProject(getProjectsContainerFromStorage()[0]);
    projectDiv.remove();
  }
}

function handleTodoItemOnClick(event) {
  const todoItem = event.target.closest(todoItemLi.selector);
  DOM.removeItemContentsfromDisplay();
  setCurrentlySelectedTodoItem(getCurrentItemFromEvent(todoItem));
  DOM.displayTodoItemContents(currentlySelectedTodoItem);
  DOM.removeCurrentlySelectedClassFromHolder(
    ".currentlySelected.todoItemListItem"
  );
  DOM.addCurrentlySelectedClass(todoItem);
}

function handleDeleteButtonsForTodoItems(event) {
  const todoItem = event.target.closest(todoItemLi.selector);

  if (isLast(DOM.getTodoItemsOnDisplay())) throw Error("Cant delete last item");

  const index = getIndexOfElementFromEvent(todoItem);
  project.removeItem(
    currentlySelectedProject.items[index],
    currentlySelectedProject
  );
  todoItem.remove();
  DOM.removeItemContentsfromDisplay();
  DOM.displayTodoItemContents(currentlySelectedProject.items[0]);
  setProjectsContainerFromStorage();
}

const _addEventListenerToTodoItemButton = (event) => {
  const button = document.querySelector(".createTodoItem");
  button.addEventListener("click", (event) => {
    addItemToCurrentlySelectedProject();
    DOM.removeTodoItemsContainer();
    DOM.displayTodoItems(event);
    setProjectsContainerFromStorage();
  });
};

const _addEventListenerToProjectButton = () => {
  const button = document.querySelector(".createProject");
  button.addEventListener("click", () => {
    setCurrentlySelectedProject(DOM.createProjectWithTodoItem());
    setProjectsContainerFromStorage();
    DOM.clearProjectsOnDisplay();
    DOM.displayProjects();
    _addEventListenersToProjects();
  });
};

const _addEventListenersToItemContent = () => {
  const itemContent = document.querySelector(".itemContentDisplay");
  itemContent.addEventListener("change", (event) => {
    DOM.updateTodoItemValues();
    DOM.updatePriorityIndicator();
    setProjectsContainerFromStorage();
    const titleTextarea = 0;
    if (getIndexOfElementFromEvent(event.target) == titleTextarea) {
      DOM.removeTodoItemsContainer();
      DOM.displayTodoItems();
    }
  });
};

function addEventListeners() {
  _addEventListenersToProjects();
  _addEventListenerToTodoItemButton();
  _addEventListenerToProjectButton();
  _addEventListenersToItemContent();
}

export { addEventListeners, addEventListenerToBody };
// fix: handleChecklistRemoveButtons fires on every click. Find a way to only run when its right
