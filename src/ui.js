import {
  project,
  todoItem,
  setProjectsContainerFromStorage,
  getIndexOfElementFromEvent,
  getCurrentItemFromEvent,
  isLast,
  getProjectsContainerFromStorage,
  createProjectWithTodoItem,
} from "./logic";
import { DOM } from "./dom";

function addEventListenerToBody() {
  document.body.addEventListener("click", handleClickOnBody);
  document.body.addEventListener("change", handleChangeOnBody);
  document.body.addEventListener("focusout", handleFocusOutOnBody);
  document.body.addEventListener("dblclick", handleDblClickOnBody);
}

function handleChangeOnBody(event) {
  executeHandler([todoItemContent], event);
  setProjectsContainerFromStorage();
}

function handleFocusOutOnBody(event) {
  executeHandler([projectDivOnFocusOut], event);
  setProjectsContainerFromStorage();
}

function handleDblClickOnBody(event) {
  executeHandler([projectDivOnDblClick], event);
  setProjectsContainerFromStorage();
}

function handleClickOnBody(event) {
  executeHandler(
    [
      checklistCheckbox,
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
  setProjectsContainerFromStorage();
}

function selectorAndHandler(selector, handler) {
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
const checklistRemoveButton = selectorAndHandler(
  "li.checklistItem > button.remove",
  handleChecklistRemoveButtons
);

const checklistAddButton = selectorAndHandler(
  "li.checklistItem > button.add",
  handleChecklistAddButtons
);

const checklistCheckbox = selectorAndHandler(
  "li.checklistItem > input[type='checkbox']",
  () => {
    DOM.updatePriorityIndicator();
  }
);

const projectDiv = selectorAndHandler("div.project", handleProjectDivOnClick);

const projectDivDeleteButton = selectorAndHandler(
  "div.project > button.deleteButton",
  handleDeleteButtonsForProjects
);

const todoItemLi = selectorAndHandler(
  "ul.todoItems > li.todoItemListItem",
  handleTodoItemOnClick
);

const todoItemDeleteButton = selectorAndHandler(
  "li.todoItemListItem > button.deleteButton",
  handleDeleteButtonsForTodoItems
);

const createTodoItemButton = selectorAndHandler(
  "button.createTodoItem",
  handleCreateTodoItemButtonOnClick
);

const createProjectButton = selectorAndHandler(
  "button.createProject",
  handleCreateProjectButtonOnClick
);

const todoItemContent = selectorAndHandler(
  ".itemContentDisplay",
  handleItemContentOnChange
);

const projectDivOnDblClick = selectorAndHandler(
  ".project > textarea",
  handleProjectDivOnDblClick
);

const projectDivOnFocusOut = selectorAndHandler(
  ".project > textarea",
  handleProjectDivOnFocusOut
);

function handleChecklistRemoveButtons(event) {
  const checklist = document.querySelector(".checklist");
  if (checklist.childElementCount != 1) {
    const checklistItem = event.target.parentNode;
    const itemForRemovalIndex = getIndexOfElementFromEvent(checklistItem);
    todoItem.checklist.removeItem(itemForRemovalIndex, todoItem.selected);
    checklistItem.remove();
  } else console.error("Cant delete last checklist item");
}

function handleChecklistAddButtons() {
  const newChecklistItem = todoItem.checklist.createItem(
    "Create a checklist item here"
  );
  todoItem.checklist.addItem(newChecklistItem, todoItem.selected);
  DOM.refreshDisplay("todoItemContents", todoItem.selected);
  setProjectsContainerFromStorage();
}

function handleProjectDivOnClick(event) {
  setProjectsContainerFromStorage();
  const projectDiv = event.target.closest("div.project");
  // this solution below is more robust because I wont have to re Index everytime i clear projects.
  const index = getIndexOfElementFromEvent(projectDiv) - 1; //-1 because header is included in parent element
  project.setSelected(project.container[index]);
  todoItem.setSelected(project.selected.items[0]);
  DOM.refreshDisplay("todoItems");
  DOM.refreshDisplay("todoItemContents", project.selected.items[0]);
  DOM.toggleCurrentlySelectedClass(projectDiv, ".currentlySelected.project");
  DOM.toggleCurrentlySelectedClass(DOM.getTodoItemsOnDisplay()[0]);
}

function handleProjectDivOnDblClick(event) {
  event.target.closest(projectDivOnDblClick.selector).readOnly = false;
}

function handleProjectDivOnFocusOut(event) {
  event.target.closest(projectDivOnFocusOut.selector).readOnly = true;
  project.selected.title = event.target.value;
}

function handleDeleteButtonsForProjects(event) {
  if (isLast(DOM.getProjectsOnDisplay()) == true)
    throw Error("Cant delete last project");

  const projectDiv = event.target.closest("div.project");
  const index = getIndexOfElementFromEvent(event.target.parentNode) - 1; //-1 because header is included in parent element
  project.removeFromProjectsContainer(project.container[index]);
  setProjectsContainerFromStorage();
  project.setSelected(getProjectsContainerFromStorage()[0]);
  projectDiv.remove();
  DOM.refreshDisplay("todoItems");
  DOM.refreshDisplay("todoItemContents", project.selected.items[0]);
  DOM.toggleCurrentlySelectedClass(
    DOM.getProjectsOnDisplay()[0],
    ".currentlySelected.project"
  );
  DOM.toggleCurrentlySelectedClass(DOM.getTodoItemsOnDisplay()[0]);
}

function handleTodoItemOnClick(event) {
  const thisTodoItemLi = event.target.closest(todoItemLi.selector);
  todoItem.setSelected(getCurrentItemFromEvent(thisTodoItemLi));
  DOM.refreshDisplay("todoItemContents", todoItem.selected);
  DOM.toggleCurrentlySelectedClass(
    thisTodoItemLi,
    ".currentlySelected.todoItemListItem"
  );
}

function handleDeleteButtonsForTodoItems(event) {
  const todoItem = event.target.closest(todoItemLi.selector);

  if (isLast(DOM.getTodoItemsOnDisplay())) throw Error("Cant delete last item");

  const index = getIndexOfElementFromEvent(todoItem);
  project.removeItem(project.selected.items[index], project.selected);
  todoItem.remove();
  setProjectsContainerFromStorage();
  DOM.refreshDisplay("todoItemContents", project.selected.items[0]);
  DOM.toggleCurrentlySelectedClass(
    DOM.getTodoItemsOnDisplay()[0],
    ".currentlySelected.todoItemListItem"
  );
}

function handleCreateTodoItemButtonOnClick() {
  const newItem = todoItem.create("Untitled Item");
  project.addItem(newItem, project.selected);
  todoItem.setSelected(newItem);
  DOM.refreshDisplay("todoItems");
  DOM.refreshDisplay("todoItemContents", newItem);
  DOM.toggleCurrentlySelectedClass(
    DOM.getTodoItemsOnDisplay()[DOM.getTodoItemsOnDisplay().length - 1]
  );
  setProjectsContainerFromStorage();
}

function handleCreateProjectButtonOnClick() {
  project.setSelected(createProjectWithTodoItem());
  setProjectsContainerFromStorage();
  DOM.refreshDisplay("projects");
  DOM.refreshDisplay("todoItems");
  DOM.refreshDisplay("todoItemContents", project.selected.items[0]);
  DOM.updatePriorityIndicator();
  DOM.toggleCurrentlySelectedClass(
    DOM.getProjectsOnDisplay()[DOM.getProjectsOnDisplay().length - 1],
    ".currentlySelected.project"
  );
}

function handleItemContentOnChange(event) {
  DOM.updateTodoItemValues();
  DOM.updatePriorityIndicator();
  setProjectsContainerFromStorage();
  //will redisplay todoItems if the title text area is changed
  if (
    event.target.previousSibling === null &&
    event.target.nodeName === "TEXTAREA"
  ) {
    document.querySelector(
      "li.todoItemListItem.currentlySelected > h3"
    ).textContent = todoItem.selected.title;
  }
}

export { addEventListenerToBody };
