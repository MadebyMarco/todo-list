import {
  project,
  todoItem,
  setProjectsContainerFromStorage,
  getProjectsContainerFromStorage,
  currentlySelectedProject,
  currentlySelectedTodoItem,
} from "./logic.js";

const DOM = (() => {
  const contentDiv = document.querySelector("#content");

  const _createProjectButton = () => {
    const button = document.createElement("button");
    button.textContent = "Create New Project +";
    button.classList.add("createProject");
    return button;
  };

  const _createTodoItemButton = () => {
    const button = document.createElement("button");
    button.textContent = "Add todo item+";
    button.classList.add("createTodoItem");
    return button;
  };

  const _createTodoItemsDiv = () => {
    const div = document.createElement("div");
    const h1 = document.createElement("h1");
    h1.textContent = "Todo Items";
    div.appendChild(h1);
    div.classList.add("todoItemsContainer");
    return div;
  };

  const _createTodoItemContentDiv = () => {
    const div = document.createElement("div");
    div.classList.add("itemContentDisplay");
    return div;
  };

  const displayTodoItems = () => {
    const todoContainer = document.querySelector(".todoItemsContainer");
    const ul = document.createElement("ul");
    ul.classList.add("todoItems");
    currentlySelectedProject.items.forEach((item) => {
      const li = document.createElement("li");
      const h3 = document.createElement("h3");
      const p = document.createElement("p");

      p.textContent = "●";
      p.classList.add("priorityIndicator");
      li.classList.add("todoItemListItem");
      h3.textContent = `${item.title}`;

      li.append(h3, p, _createDeleteButton());
      ul.append(li);
    });
    todoContainer.appendChild(ul);
  };
  //add a way to create new checklist items, remove them too
  const _createChecklist = (item) => {
    const ul = document.createElement("ul");
    for (let i = 0; i < item.checklist.length; i++) {
      const li = document.createElement("li");
      const textarea = document.createElement("textarea");
      const input = document.createElement("input");
      const addChecklistItemButtom = document.createElement("button");
      const removeChecklistItemButton = document.createElement("button");
      const currentChecklistItem = item.checklist[i];

      addChecklistItemButtom.textContent = "+";
      removeChecklistItemButton.textContent = "-";
      input.type = "checkbox";
      textarea.textContent = `${currentChecklistItem.checklistItemName}`;
      addChecklistItemButtom.classList.add("add");
      removeChecklistItemButton.classList.add("remove");
      li.classList.add("checklistItem");
      ul.classList.add("checklist");

      if (currentChecklistItem.checked == true) {
        input.checked = true;
      } else input.checked = false;

      li.append(
        input,
        textarea,
        addChecklistItemButtom,
        removeChecklistItemButton
      );
      ul.append(li);
    }
    return ul;
  };

  const displayTodoItemContents = (item) => {
    const container = document.querySelector(".itemContentDisplay");
    const itemTitle = document.createElement("textarea");
    const itemDescription = document.createElement("textarea");
    const itemDueDate = document.createElement("textarea");
    const itemPriority = document.createElement("select");
    const choosePriority = document.createElement("option");
    const itemPriorityLow = document.createElement("option");
    const itemPriorityMedium = document.createElement("option");
    const itemPriorityHigh = document.createElement("option");
    const itemNotes = document.createElement("textarea");

    itemTitle.textContent = `${item.title}`;
    itemDescription.textContent = `${item.description}`;
    itemDueDate.textContent = `${item.dueDate}`;
    itemNotes.textContent = `${item.notes}`;
    choosePriority.textContent = "Level of importance";
    itemPriorityLow.textContent = "Low";
    itemPriorityMedium.textContent = "Medium";
    itemPriorityHigh.textContent = "High";

    switch (item.priority) {
      case "low":
        itemPriorityLow.selected = true;
        break;
      case "medium":
        itemPriorityMedium.selected = true;
        break;
      case "high":
        itemPriorityHigh.selected = true;
        break;
      default:
        choosePriority.selected = true;
    }

    itemPriority.append(
      choosePriority,
      itemPriorityLow,
      itemPriorityMedium,
      itemPriorityHigh
    );

    container.append(
      itemTitle,
      itemDescription,
      itemDueDate,
      itemPriority,
      itemNotes,
      _createChecklist(item)
    );
  };

  const updatePriorityIndicator = () => {
    const indicators = document.querySelectorAll(".priorityIndicator");
    for (let i = 0; i < indicators.length; i++) {
      const currentIndicator = indicators[i];
      const currentItem = currentlySelectedProject.items[i];
      currentIndicator.classList.remove("low", "medium", "high", "transparent");

      switch (currentItem.priority) {
        case "low":
          currentIndicator.classList.add("low");
          break;
        case "medium":
          currentIndicator.classList.add("medium");
          break;
        case "high":
          currentIndicator.classList.add("high");
          break;
        case "priority":
          currentIndicator.classList.add("transparent");
          break;
        default:
          currentIndicator.classList.add("transparent");
      }
    }
  };

  //todo: create a function that sets the text content of todo items to its corresponding object
  const updateTodoItemValues = () => {
    const Inputs = document.querySelectorAll(".itemContentDisplay > *");
    console.log(Inputs);
    const title = Inputs[0].value;
    const description = Inputs[1].value;
    const dueDate = Inputs[2].value;
    let priority = Inputs[3].childNodes;
    const notes = Inputs[4].value;
    const checklist = Inputs[5].childNodes;
    console.log(description);

    // sets priority value
    for (const option of priority) {
      if (option.selected == true) priority = option.textContent.toLowerCase();
    }

    currentlySelectedTodoItem.title = title;
    currentlySelectedTodoItem.description = description;
    currentlySelectedTodoItem.dueDate = dueDate;
    currentlySelectedTodoItem.priority = priority;
    currentlySelectedTodoItem.notes = notes;

    for (let i = 0; i < checklist.length; i++) {
      const itemName = checklist[i].childNodes[1].value;
      const itemCheckedStatus = checklist[i].childNodes[0].checked;

      //sets checklist item names and checked status
      currentlySelectedTodoItem.checklist[i].checked = itemCheckedStatus;
      currentlySelectedTodoItem.checklist[i].checklistItemName = `${itemName}`;
    }
  };

  const removeItemContentsfromDisplay = () => {
    const itemContents = () =>
      document.querySelectorAll(".itemContentDisplay > *");
    if (itemContents() == null) {
      console.log("items not found");
    } else {
      for (const item of itemContents()) {
        item.remove();
      }
    }
  };

  const _getTodoItemsContainer = () => document.querySelector(".todoItems");

  const removeTodoItemsContainer = () => {
    _getTodoItemsContainer().remove();
  };

  const getTodoItemsOnDisplay = () =>
    document.querySelectorAll("li.todoItemListItem");

  const _createProjectsDiv = () => {
    const div = document.createElement("div");
    div.classList.add("projectsContainer");
    const h1 = document.createElement("h1");
    h1.textContent = "Your Projects";
    div.appendChild(h1);
    return div;
  };

  const getProjectsOnDisplay = () =>
    document.querySelectorAll(".projectsContainer > .project");

  const clearProjectsOnDisplay = () => {
    getProjectsOnDisplay().forEach((project) => project.remove());
  };

  const displayProjects = () => {
    const container = document.querySelector(".projectsContainer");
    getProjectsContainerFromStorage().forEach((project) => {
      const div = document.createElement("div");
      const textarea = document.createElement("textarea");

      textarea.textContent = `${project.title}`;
      textarea.readOnly = true;
      div.classList.add("project");

      div.append(textarea, _createDeleteButton());
      container.appendChild(div);
    });
  };
  const _createDeleteButton = () => {
    const button = document.createElement("button");
    button.textContent = "Delete";
    button.classList.add("deleteButton");
    return button;
  };

  const addCurrentlySelectedClass = (classReceiver) => {
    classReceiver.classList.add("currentlySelected");
  };

  const removeCurrentlySelectedClass = (classHolder) => {
    classHolder.classList.remove("currentlySelected");
  };

  const getCurrentlySelectedClassHolder = (querySelector) =>
    document.querySelector(querySelector);

  const removeCurrentlySelectedClassFromHolder = (querySelector) => {
    if (getCurrentlySelectedClassHolder(querySelector)) {
      removeCurrentlySelectedClass(
        getCurrentlySelectedClassHolder(querySelector)
      );
    } else new Error("No currently selected class holder found");
  };

  const displayFirstItemContent = (project) => {
    const firstItem = project.items[0];
    displayTodoItemContents(firstItem);
  };

  const load = () => {
    contentDiv.append(
      _createProjectButton(),
      _createTodoItemButton(),
      _createProjectsDiv(),
      _createTodoItemsDiv(),
      _createTodoItemContentDiv()
    );
    displayProjects();
    displayTodoItems();
    displayFirstItemContent(currentlySelectedProject);
    updatePriorityIndicator();
    addCurrentlySelectedClass(getProjectsOnDisplay()[0]);
    addCurrentlySelectedClass(getTodoItemsOnDisplay()[0]);
    setProjectsContainerFromStorage(); //move this to indx
  };

  return {
    load,
    displayProjects,
    getProjectsOnDisplay,
    removeItemContentsfromDisplay,
    displayTodoItems,
    displayTodoItemContents,
    getTodoItemsOnDisplay,
    removeTodoItemsContainer,
    displayFirstItemContent,
    updatePriorityIndicator,
    addCurrentlySelectedClass,
    removeCurrentlySelectedClass,
    getCurrentlySelectedClassHolder,
    removeCurrentlySelectedClassFromHolder,
    clearProjectsOnDisplay,
    updateTodoItemValues,
  };
})();

export { DOM };
