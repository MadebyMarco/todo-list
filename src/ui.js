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
    [checklistRemoveButton, checklistAddButton, projectDiv],
    event
  );
}

function clickEvent(selector, handler) {
  return { selector, handler };
}

function executeHandler(handlers, event) {
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
  _handleAddButtons
);

const projectDiv = clickEvent("div.project > textarea", handleProjectDiv);

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
    // DOM.removeItemContentsfromDisplay();
    // DOM.displayTodoItemContents(currentlySelectedTodoItem);
    // addEventListenersToChecklistButtons();
    setProjectsContainerFromStorage();
  } else console.error("Cant delete last checklist item");
}

function _handleAddButtons() {
  const newChecklistItem = todoItem.checklist.createItem(
    "Create a checklist item here"
  );
  todoItem.checklist.addItem(newChecklistItem, currentlySelectedTodoItem);
  DOM.removeItemContentsfromDisplay();
  DOM.displayTodoItemContents(currentlySelectedTodoItem);
  setProjectsContainerFromStorage();
}
const addEventListenersToChecklistButtons = () => {
  // const removeButtons = document.querySelectorAll(".checklistItem .remove");
  // for(let i = 0; i < removeButtons.length; i++) {
  //     removeButtons[i].addEventListener("click", (event) => handleChecklistRemoveButtons(event));
  // }
  // const addButtons = document.querySelectorAll(".checklistItem .add");
  // for (let i = 0; i < addButtons.length; i++) {
  //   addButtons[i].addEventListener("click", _handleAddButtons);
  // }
};

function handleProjectDiv(event) {
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
  _addEventListenersToTodoItems();
  DOM.updatePriorityIndicator();
  _handleDeleteButtonsForProjects(event);
  DOM.removeCurrentlySelectedClassFromHolder(".currentlySelected.project");
  DOM.addCurrentlySelectedClass(event.target.closest("div.project"));
}

const _addEventListenersToProjects = () => {
  DOM.getProjectsOnDisplay().forEach((project) => {
    // project.addEventListener("click", (event) => {
    //   setProjectsContainerFromStorage();
    //   // this solution below is more robust because I wont have to re Index everytime i clear projects.
    //   const index = getIndexOfElementFromEvent(event.currentTarget) - 1; //-1 because header is included in parent element
    //   setCurrentlySelectedProject(projectsContainer[index]);
    //   DOM.removeTodoItemsContainer();
    //   DOM.removeItemContentsfromDisplay();
    //   setCurrentTodoItemToFirstItemOfCurrentProject();
    //   DOM.displayTodoItems();
    //   DOM.displayFirstItemContent(currentlySelectedProject);
    //   _addEventListenersToTodoItems();
    //   addEventListenersToChecklistButtons();
    //   DOM.updatePriorityIndicator();
    //   _handleDeleteButtonsForProjects(event);
    //   DOM.removeCurrentlySelectedClassFromHolder(".currentlySelected.project");
    //   DOM.addCurrentlySelectedClass(event.currentTarget);
    // });

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

const _handleDeleteButtonsForProjects = (event) => {
  if (event.target.classList.contains("deleteButton")) {
    if (isLast(DOM.getProjectsOnDisplay()) == false) {
      const index = getIndexOfElementFromEvent(event.currentTarget) - 1; //-1 because header is included in parent element
      project.removeFromProjectsContainer(projectsContainer[index]);
      setProjectsContainerFromStorage();
      DOM.clearProjectsOnDisplay();
      DOM.displayProjects();
      _addEventListenersToProjects();
      setCurrentlySelectedProject(projectsContainer[0]);
    } else throw Error("Cant delete last project");
  }
};

const _addEventListenersToTodoItems = () => {
  const todoItems = document.querySelectorAll(".todoItemListItem");
  for (let i = 0; i < todoItems.length; i++) {
    todoItems[i].addEventListener("click", (event) => {
      DOM.removeItemContentsfromDisplay();
      setCurrentlySelectedTodoItem(getCurrentItemFromEvent(event));
      DOM.displayTodoItemContents(currentlySelectedTodoItem);
      addEventListenersToChecklistButtons();
      _handleDeleteButtonsForTodoItems(event);
      DOM.removeCurrentlySelectedClassFromHolder(
        ".currentlySelected.todoItemListItem"
      );
      DOM.addCurrentlySelectedClass(event.currentTarget);
    });
  }
};

const _handleDeleteButtonsForTodoItems = (event) => {
  if (event.target.classList.contains("deleteButton")) {
    if (isLast(DOM.getTodoItemsOnDisplay()) == false) {
      const index = getIndexOfElementFromEvent(event.currentTarget);
      project.removeItem(
        currentlySelectedProject.items[index],
        currentlySelectedProject
      );
      DOM.getTodoItemsOnDisplay()[index].remove();
      setProjectsContainerFromStorage();
    } else throw Error("Cant delete last item");
  }
};
const _addEventListenerToTodoItemButton = (event) => {
  const button = document.querySelector(".createTodoItem");
  button.addEventListener("click", (event) => {
    addItemToCurrentlySelectedProject();
    DOM.removeTodoItemsContainer();
    DOM.displayTodoItems(event);
    _addEventListenersToTodoItems(event);
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
      _addEventListenersToTodoItems();
    }
  });
};

function addEventListeners() {
  _addEventListenersToProjects();
  _addEventListenersToTodoItems();
  _addEventListenerToTodoItemButton();
  _addEventListenerToProjectButton();
  addEventListenersToChecklistButtons();
  _addEventListenersToItemContent();
}

export { addEventListeners, addEventListenerToBody };
// fix: handleChecklistRemoveButtons fires on every click. Find a way to only run when its right
