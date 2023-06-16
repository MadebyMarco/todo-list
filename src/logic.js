// TOdo list items
// {title, descriptions, dueDate, priority, notes, checklist}

//todo lists will be separated through projects ex. {mondays todo list: do x y z, nephews birthday: do a b c} mondays todo list and nephews birthday are each a project.
// for conveniece, we will have a default project that users can easily put todo list items into
// users will be able to choose which project to add todo list items to

//todo list logic will be kept in one module while todo list DOM manipulation will be in another module
// todoItem for logic, todoItemDOM for dom manipulation
const project = (() => {
  const create = (title, items = []) => {
    return { title, items };
  };

  const addToProjectsContainer = (project) => {
    projectsContainer.push(project);
  };

  const removeFromProjectsContainer = (projectForRemoval) => {
    const index = projectsContainer.findIndex(
      (project) => project.title == projectForRemoval.title
    );
    projectsContainer.splice(index, 1);
  };

  // separated adding items to project to follow single responsibility principle
  const addItem = (item, project) => {
    project.items.push(item);
  };

  const removeItem = (itemForRemoval, project) => {
    const index = project.items.findIndex(
      (item) => item.title == itemForRemoval.title
    );
    project.items.splice(index, 1);
  };

  return {
    create,
    addToProjectsContainer,
    removeFromProjectsContainer,
    addItem,
    removeItem,
  };
})();

const todoItem = (() => {
  const create = (
    title,
    description = "description",
    dueDate = "due date",
    priority = "priority",
    notes = "notes",
    completed,
    ...checklist
  ) => {
    if (checklist.length == 0) {
      checklist.push(
        todoItem.checklist.createItem("Create a checklist item here")
      );
    }

    return {
      title, //input text
      description, //input text
      dueDate, //input
      priority, //select
      notes, //input field or text
      completed, // radio button
      checklist, //textarea, checkbox, buttons
    };
  };

  // Making the checklist conversion into a separate function instead of a todoItem property/interal job
  // by making items on my check list objects with two keys, name & checked, I can store store and render the info easily.
  // I need to make every input into checklist an object. I can forEach over and set name to whatever is in checklist.

  const checklist = (() => {
    const createItem = (checklistItemName, checked = false) => {
      return {
        checklistItemName,
        checked,
      };
    };

    //need to find a way to check a list item
    //First I will search through a todoItem's checklist using the listItems index
    const checkItem = (listItemIndex, todoItem) => {
      todoItem.checklist[listItemIndex].checked = true;
    };

    const uncheckItem = (listItemIndex, todoItem) => {
      todoItem.checklist[listItemIndex].checked = false;
    };

    const convertToObjects = (todoItem) => {
      // const objectChecklist = [];
      // todoItem.checklist.forEach(item => {
      //     if (!(typeof item == "object" && item !==null)) { //wont nest objects
      //         const itemObject = {checklistItemName: `${item}`, checked: false};
      //         objectChecklist.push(itemObject);
      //     }

      // });

      // todoItem.checklist = objectChecklist;
      for (let i = 0; i < todoItem.checklist.length; i++) {
        todoItem.checklist.reverse(); //index0 = currentItem, is now last
        const currentChecklistItem = todoItem.checklist.pop(); // currentItem is popped out
        const newChecklistItem = createItem(currentChecklistItem); //currentItem is created into an object
        todoItem.checklist.splice(i, 0, newChecklistItem); //currentItem is pushed back in at index of i variable.
        todoItem.checklist.reverse(); //current Item is back into normal array
      }
    };

    const addItem = (checklistItem, todoItem) => {
      todoItem.checklist.push(checklistItem);
    };

    const removeItem = (checklistItemIndex, todoItem) => {
      todoItem.checklist.splice(checklistItemIndex, 1);
    };

    return {
      createItem,
      checkItem,
      uncheckItem,
      convertToObjects,
      addItem,
      removeItem,
    };
  })();

  const markCompleted = (todoItem) => {
    todoItem.completed = true;
  };

  const markNotCompleted = (todoItem) => {
    todoItem.completed = false;
  };

  return {
    create,
    markCompleted,
    markNotCompleted,
    checklist,
  };
})();

const defaultProject = project.create("default");
const test1 = project.create("test1", [todoItem.create("showering")]);
const test2 = project.create("test2", [todoItem.create("gaming")]);
let projectsContainer = [];

const createProjectWithTodoItem = () => {
  const newProject = project.create("New Project Title");
  const newItem = todoItem.create("New Item Title");
  project.addToProjectsContainer(newProject);
  project.addItem(newItem, newProject);
  return newProject;
};

const isLast = (array) => {
  if (array.length == 1) {
    return true;
  } else return false;
};

const setProjectsContainerFromStorage = () => {
  localStorage.setItem("projectsContainer", JSON.stringify(projectsContainer));
  console.log("projects container has been updated");
};

const syncProjectsContainers = () => {
  console.log("syncing containers");
  projectsContainer = getProjectsContainerFromStorage();
};

const getProjectsContainerFromStorage = () =>
  JSON.parse(localStorage.getItem("projectsContainer"));

/** 
 Structure for implementing local storage into already existing code that runs without it
 1. The projectsContainer in and not in localStorage are fighting against eachother. 
    1.1 Set the startup variable to the localStorage one on startup. 
        This will prevent the default variable from overwriting the localStorage on start
    1.2 create a function that will return a boolean on weather or not a localStorage of projectsContainer exists

2. Updating the stored variable 
    I think I can literally just update the projectsContainer 
    When I update it is important. For the most part. I think setting the projects container is the important part. IT was.
 * */

const defaultItem = todoItem.create(
  "Title your first todo item",
  "You can write descriptions here",
  "due dates go here",
  "low",
  "area for quick notes",
  false,
  todoItem.checklist.createItem("create check list items here"),
  todoItem.checklist.createItem("Click on the + to create"),
  todoItem.checklist.createItem("and the - to remove")
);

project.addItem(defaultItem, defaultProject);
project.addToProjectsContainer(defaultProject);

let currentlySelectedProject = getProjectsContainerFromStorage()[0];
let currentlySelectedTodoItem = currentlySelectedProject.items[0];

const addItemToCurrentlySelectedProject = () => {
  const newItem = todoItem.create("Empty");
  project.addItem(newItem, currentlySelectedProject);
};

const setCurrentlySelectedProject = (project) => {
  currentlySelectedProject = project;
};

const setCurrentTodoItemToFirstItemOfCurrentProject = () => {
  currentlySelectedTodoItem = currentlySelectedProject.items[0];
};

function setCurrentlySelectedTodoItem(todoItem) {
  currentlySelectedTodoItem = todoItem;
}

const getIndexOfElementFromEvent = (eventTargetChild) => {
  // const siblings = [...event.target.parentNode.parentNode.children];
  // const targetChild = event.target.parentNode;
  // const siblings = [...event.currentTarget.parentNode.children];
  // const targetChild = event.currentTarget;
  if (eventTargetChild == null) {
    console.log("No child found");
  }
  const siblings = [...eventTargetChild.parentNode.children];
  const targetChild = eventTargetChild;
  const index = siblings.indexOf(targetChild);
  return index;
};

const getCurrentItemFromEvent = (target) => {
  const index = getIndexOfElementFromEvent(target);
  const currentItem = currentlySelectedProject.items[index];
  return currentItem;
};

export {
  project,
  todoItem,
  projectsContainer,
  syncProjectsContainers,
  setProjectsContainerFromStorage,
  getProjectsContainerFromStorage,
  setCurrentlySelectedProject,
  addItemToCurrentlySelectedProject,
  setCurrentTodoItemToFirstItemOfCurrentProject,
  setCurrentlySelectedTodoItem,
  currentlySelectedProject,
  currentlySelectedTodoItem,
  isLast,
  getIndexOfElementFromEvent,
  getCurrentItemFromEvent,
  createProjectWithTodoItem,
};
