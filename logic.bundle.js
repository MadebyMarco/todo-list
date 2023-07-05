/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/logic.js":
/*!**********************!*\
  !*** ./src/logic.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createProjectWithTodoItem\": () => (/* binding */ createProjectWithTodoItem),\n/* harmony export */   \"getCurrentItemFromEvent\": () => (/* binding */ getCurrentItemFromEvent),\n/* harmony export */   \"getIndexOfElementFromEvent\": () => (/* binding */ getIndexOfElementFromEvent),\n/* harmony export */   \"getProjectsContainerFromStorage\": () => (/* binding */ getProjectsContainerFromStorage),\n/* harmony export */   \"isLast\": () => (/* binding */ isLast),\n/* harmony export */   \"project\": () => (/* binding */ project),\n/* harmony export */   \"setProjectsContainerFromStorage\": () => (/* binding */ setProjectsContainerFromStorage),\n/* harmony export */   \"syncProjectsContainers\": () => (/* binding */ syncProjectsContainers),\n/* harmony export */   \"todoItem\": () => (/* binding */ todoItem)\n/* harmony export */ });\n// TOdo list items\n// {title, descriptions, dueDate, priority, notes, checklist}\n\n//todo lists will be separated through projects ex. {mondays todo list: do x y z, nephews birthday: do a b c} mondays todo list and nephews birthday are each a project.\n// for conveniece, we will have a default project that users can easily put todo list items into\n// users will be able to choose which project to add todo list items to\n\n//todo list logic will be kept in one module while todo list DOM manipulation will be in another module\n// todoItem for logic, todoItemDOM for dom manipulation\n\nconst project = (() => {\n  let container = [];\n\n  const create = (title, items = []) => {\n    return { title, items };\n  };\n\n  let selected;\n\n  const setSelected = (thisProject) => {\n    project.selected = thisProject;\n    console.log(project.selected);\n  };\n\n  const addToProjectsContainer = (thisProject) => {\n    project.container.push(thisProject);\n  };\n\n  const removeFromProjectsContainer = (projectForRemoval) => {\n    const index = container.findIndex(\n      (project) => project.title == projectForRemoval.title\n    );\n    project.container.splice(index, 1);\n  };\n\n  // separated adding items to project to follow single responsibility principle\n  const addItem = (item, project) => {\n    project.items.push(item);\n  };\n\n  const removeItem = (itemForRemoval, project) => {\n    const index = project.items.findIndex(\n      (item) => item.title == itemForRemoval.title\n    );\n    project.items.splice(index, 1);\n  };\n\n  return {\n    container,\n    create,\n    selected,\n    setSelected,\n    addToProjectsContainer,\n    removeFromProjectsContainer,\n    addItem,\n    removeItem,\n  };\n})();\n\nconst todoItem = (() => {\n  const create = (\n    title,\n    description = \"description\",\n    dueDate = \"due date\",\n    priority = \"priority\",\n    notes = \"notes\",\n    completed,\n    ...checklist\n  ) => {\n    if (checklist.length == 0) {\n      checklist.push(\n        todoItem.checklist.createItem(\"Create a checklist item here\")\n      );\n    }\n\n    return {\n      //createTodoItem return\n      title, //input text\n      description, //input text\n      dueDate, //input\n      priority, //select\n      notes, //input field or text\n      completed, // radio button\n      checklist, //textarea, checkbox, buttons\n    };\n  };\n\n  let selected;\n\n  function setSelected(thisTodoItem) {\n    todoItem.selected = thisTodoItem;\n  }\n  // Making the checklist conversion into a separate function instead of a todoItem property/interal job\n  // by making items on my check list objects with two keys, name & checked, I can store store and render the info easily.\n  // I need to make every input into checklist an object. I can forEach over and set name to whatever is in checklist.\n\n  const checklist = (() => {\n    const createItem = (checklistItemName, checked = false) => {\n      return {\n        checklistItemName,\n        checked,\n      };\n    };\n\n    //need to find a way to check a list item\n    //First I will search through a todoItem's checklist using the listItems index\n    const checkItem = (listItemIndex, todoItem) => {\n      todoItem.checklist[listItemIndex].checked = true;\n    };\n\n    const uncheckItem = (listItemIndex, todoItem) => {\n      todoItem.checklist[listItemIndex].checked = false;\n    };\n\n    const addItem = (checklistItem, todoItem) => {\n      todoItem.checklist.push(checklistItem);\n    };\n\n    const removeItem = (checklistItemIndex, todoItem) => {\n      todoItem.checklist.splice(checklistItemIndex, 1);\n    };\n\n    return {\n      //checklist return\n      createItem,\n      checkItem,\n      uncheckItem,\n      addItem,\n      removeItem,\n    };\n  })();\n\n  const markCompleted = (todoItem) => {\n    todoItem.completed = true;\n  };\n\n  const markNotCompleted = (todoItem) => {\n    todoItem.completed = false;\n  };\n\n  return {\n    // todoItem return\n    selected,\n    setSelected,\n    create,\n    markCompleted,\n    markNotCompleted,\n    checklist,\n  };\n})();\n\nconst defaultProject = project.create(\"default\");\nconst test1 = project.create(\"test1\", [todoItem.create(\"showering\")]);\nconst test2 = project.create(\"test2\", [todoItem.create(\"gaming\")]);\n\nconst createProjectWithTodoItem = () => {\n  const newProject = project.create(\"New Project Title\");\n  const newItem = todoItem.create(\"New Item Title\");\n  project.addToProjectsContainer(newProject);\n  project.addItem(newItem, newProject);\n  return newProject;\n};\n\nconst isLast = (array) => {\n  if (array.length == 1) {\n    return true;\n  } else return false;\n};\n\nfunction setProjectsContainerFromStorage() {\n  localStorage.setItem(\"projectsContainer\", JSON.stringify(project.container));\n  console.log(\"projects container has been updated\");\n}\n\nconst syncProjectsContainers = () => {\n  console.log(\"syncing containers\");\n  project.container = getProjectsContainerFromStorage();\n};\n\nfunction getProjectsContainerFromStorage() {\n  return JSON.parse(localStorage.getItem(\"projectsContainer\"));\n}\n\n/** \n Structure for implementing local storage into already existing code that runs without it\n 1. The projectsContainer in and not in localStorage are fighting against eachother. \n    1.1 Set the startup variable to the localStorage one on startup. \n        This will prevent the default variable from overwriting the localStorage on start\n    1.2 create a function that will return a boolean on weather or not a localStorage of projectsContainer exists\n\n2. Updating the stored variable \n    I think I can literally just update the projectsContainer \n    When I update it is important. For the most part. I think setting the projects container is the important part. IT was.\n * */\n\nconst defaultItem = todoItem.create(\n  \"Title your first todo item\",\n  \"You can write descriptions here\",\n  \"due dates go here\",\n  \"low\",\n  \"area for quick notes\",\n  false,\n  todoItem.checklist.createItem(\"create check list items here\"),\n  todoItem.checklist.createItem(\"Click on the + to create\"),\n  todoItem.checklist.createItem(\"and the - to remove\")\n);\n\nproject.addItem(defaultItem, defaultProject);\nproject.addToProjectsContainer(defaultProject);\n\nconst getIndexOfElementFromEvent = (eventTargetChild) => {\n  // const siblings = [...event.target.parentNode.parentNode.children];\n  // const targetChild = event.target.parentNode;\n  // const siblings = [...event.currentTarget.parentNode.children];\n  // const targetChild = event.currentTarget;\n  if (eventTargetChild == null) {\n    console.log(\"No child found\");\n  }\n  const siblings = [...eventTargetChild.parentNode.children];\n  const targetChild = eventTargetChild;\n  const index = siblings.indexOf(targetChild);\n  return index;\n};\n\nconst getCurrentItemFromEvent = (target) => {\n  const index = getIndexOfElementFromEvent(target);\n  const currentItem = project.selected.items[index];\n  return currentItem;\n};\n\n\n\n\n//# sourceURL=webpack://todo-list/./src/logic.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/logic.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;