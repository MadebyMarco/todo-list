import {
  project,
  todoItem,
  setProjectsContainerFromStorage,
  getIndexOfElementFromEvent,
  getCurrentItemFromEvent,
  currentlySelectedTodoItem,
  setCurrentlySelectedTodoItem,
  setCurrentTodoItemToFirstItemOfCurrentProject,
  addItemToCurrentlySelectedProject,
  isLast,
  getProjectsContainerFromStorage,
  createProjectWithTodoItem,
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
      createTodoItemButton,
      createProjectButton,
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

const createTodoItemButton = clickEvent(
  "button.createTodoItem",
  handleCreateTodoItemButtonOnClick
);

const createProjectButton = clickEvent(
  "button.createProject",
  handleCreateProjectButtonOnClick
);

function handleChecklistRemoveButtons(event) {
  const checklist = document.querySelector(".checklist");
  if (checklist.childElementCount != 1) {
    const checklistItem = event.target.parentNode;
    const itemForRemovalIndex = getIndexOfElementFromEvent(checklistItem);
    todoItem.checklist.removeItem(
      itemForRemovalIndex,
      currentlySelectedTodoItem
    );
    checklistItem.remove();
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
  setProjectsContainerFromStorage();
  const projectDiv = event.target.parentNode;
  // this solution below is more robust because I wont have to re Index everytime i clear projects.
  const index = getIndexOfElementFromEvent(projectDiv) - 1; //-1 because header is included in parent element
  project.setSelected(project.container[index]);
  DOM.removeTodoItemsContainer();
  DOM.removeItemContentsfromDisplay();
  setCurrentTodoItemToFirstItemOfCurrentProject();
  DOM.displayTodoItems();
  DOM.displayFirstItemContent(project.selected);
  DOM.updatePriorityIndicator();
  handleDeleteButtonsForProjects(event);
  DOM.removeCurrentlySelectedClassFromHolder(".currentlySelected.project");
  DOM.addCurrentlySelectedClass(event.target.closest("div.project"));
}

const _addEventListenersToProjects = () => {
  DOM.getProjectsOnDisplay().forEach((projectOnDisplay) => {
    const projectTitleTextarea = projectOnDisplay.childNodes[0];
    projectOnDisplay.addEventListener(
      "dblclick",
      () => (projectTitleTextarea.readOnly = false)
    );

    projectOnDisplay.addEventListener("focusout", () => {
      projectTitleTextarea.readOnly = true;
      project.selected.title = projectTitleTextarea.value;
      setProjectsContainerFromStorage();
    });
  });
};

function handleDeleteButtonsForProjects(event) {
  if (event.target.classList.contains("deleteButton")) {
    if (isLast(DOM.getProjectsOnDisplay()) == true)
      throw Error("Cant delete last project");

    const projectDiv = event.target.closest("div.project");
    const index = getIndexOfElementFromEvent(event.target.parentNode) - 1; //-1 because header is included in parent element
    project.removeFromProjectsContainer(project.container[index]);
    setProjectsContainerFromStorage();
    project.setSelected(getProjectsContainerFromStorage()[0]);
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
  console.log(index);
  project.removeItem(project.selected.items[index], project.selected);
  todoItem.remove();
  setProjectsContainerFromStorage();
  DOM.removeItemContentsfromDisplay();
  DOM.displayTodoItemContents(getProjectsContainerFromStorage()[0].items[0]);
}

function handleCreateTodoItemButtonOnClick() {
  addItemToCurrentlySelectedProject();
  DOM.removeTodoItemsContainer();
  DOM.displayTodoItems();
  setProjectsContainerFromStorage();
}

function handleCreateProjectButtonOnClick() {
  project.setSelected(createProjectWithTodoItem());
  setProjectsContainerFromStorage();
  DOM.clearProjectsOnDisplay();
  DOM.displayProjects();
  _addEventListenersToProjects();
}

const _addEventListenersToItemContent = () => {
  const itemContent = document.querySelector(".itemContentDisplay");
  itemContent.addEventListener("change", (event) => {
    DOM.updateTodoItemValues();
    DOM.updatePriorityIndicator();
    setProjectsContainerFromStorage();
    const titleTextarea = 0;
    //will redisplay todoItems if the title text area is changed
    if (getIndexOfElementFromEvent(event.target) == titleTextarea) {
      DOM.removeTodoItemsContainer();
      DOM.displayTodoItems();
    }
  });
};

function addEventListeners() {
  _addEventListenersToProjects();
  _addEventListenersToItemContent();
  addEventListenerToBody();
}

export { addEventListeners };
