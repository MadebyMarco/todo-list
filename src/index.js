// TOdo list items
// {title, descriptions, dueDate, priority, notes, checklist}

//todo lists will be separated through projects ex. {mondays todo list: do x y z, nephews birthday: do a b c} mondays todo list and nephews birthday are each a project.
// for conveniece, we will have a default project that users can easily put todo list items into
// users will be able to choose which project to add todo list items to

//todo list logic will be kept in one module while todo list DOM manipulation will be in another module
// todoItem for logic, todoItemDOM for dom manipulation 
import { formatDistance, formatDistanceToNow, subDays } from "date-fns";

// const project = (title, items = []) => {
//     return {title, items}
// }

const project = (() => {

    const create = (title, items = []) => {
        return {title, items}
    }
    
    const addToProjectsContainer = (project) => {
        projectsContainer.push(project)
    }
    
    const removeFromProjectsContainer = (projectForRemoval) => {
        const index = projectsContainer.findIndex(project => project.title == projectForRemoval.title);
        projectsContainer.splice(index, 1);
    }
    
    // separated adding items to project to follow single responsibility principle
    const addItem = (item, project) => {
        project.items.push(item);
    }

    const removeItem = (itemForRemoval, project) => {
        const index = project.items.findIndex(item => item.title == itemForRemoval.title);
        project.items.splice(index, 1);
    }

    return {
        create,
        addToProjectsContainer,
        removeFromProjectsContainer,
        addItem,
        removeItem
    }
})();

const todoItem = (() => {
    const create = (title, description = "description", dueDate = "due date", priority = "priority", notes = "notes", completed, ...checklist) => {

        if(checklist.length == 0) {
            checklist.push(todoItem.checklist.createItem("Create a checklist item here"));
        }
    
    
        return  {
            title, //input text
            description, //input text
            dueDate, //input
            priority, //select
            notes, //input field or text 
            completed, // radio button
            checklist, //textarea, checkbox, buttons
        }
    }

// Making the checklist conversion into a separate function instead of a todoItem property/interal job
// by making items on my check list objects with two keys, name & checked, I can store store and render the info easily.
// I need to make every input into checklist an object. I can forEach over and set name to whatever is in checklist.

    const checklist = (() => {
        const createItem = (checklistItemName, checked = false) => {
            return {
                checklistItemName,
                checked
            }
        }
        
    //need to find a way to check a list item
    //First I will search through a todoItem's checklist using the listItems index
        const checkItem = (listItemIndex, todoItem) => {
            todoItem.checklist[listItemIndex].checked = true;
            //remember to uncheck
        }
        
        const uncheckItem = (listItemIndex, todoItem) => {
            todoItem.checklist[listItemIndex].checked = false;
        }

        const convertToObjects = (todoItem) => {
            // const objectChecklist = [];
            // todoItem.checklist.forEach(item => {
            //     if (!(typeof item == "object" && item !==null)) { //wont nest objects
            //         const itemObject = {checklistItemName: `${item}`, checked: false};
            //         objectChecklist.push(itemObject);
            //     }
    
            // });
        
            // todoItem.checklist = objectChecklist;
            for(let i = 0; i < todoItem.checklist.length; i++) {
                todoItem.checklist.reverse(); //index0 = currentItem, is now last
                const currentChecklistItem = todoItem.checklist.pop(); // currentItem is popped out
                const newChecklistItem = createItem(currentChecklistItem); //currentItem is created into an object
                todoItem.checklist.splice(i, 0, newChecklistItem); //currentItem is pushed back in at index of i variable. 
                todoItem.checklist.reverse(); //current Item is back into normal array
            }
        }


        const addItem = (checklistItem, todoItem) => {
            todoItem.checklist.push(checklistItem);
        }

        const removeItem = (checklistItemIndex, todoItem) => {
            todoItem.checklist.splice(checklistItemIndex, 1);
        }

        return {
            createItem,
            checkItem,
            uncheckItem,
            convertToObjects,
            addItem,
            removeItem
        }
    })();


    const markCompleted = (todoItem) => {
        todoItem.completed = true;
    }

    const markNotCompleted = (todoItem) => {
        todoItem.completed = false;
    }

    return {
        create,
        markCompleted,
        markNotCompleted,
        checklist
    }

})();

const defaultProject = project.create("default");
const test1 = project.create("test1", [todoItem.create("showering")]);
const test2 = project.create("test2", [todoItem.create("gaming")]);
let projectsContainer = [];

const isEmpty = (array) => {
    if(array.length == 0) {
        return true;
    } else return false;
}

const isLast = (array) => {
    if(array.length == 1) {
        return true;
    } else return false;
}

const setProjectsContainerFromStorage = () => {
    localStorage.setItem("projectsContainer", JSON.stringify(projectsContainer));
    console.log({projectsContainer});
}

const syncProjectsContainers = () => {
    projectsContainer = getProjectsContainerFromStorage();
}


const getProjectsContainerFromStorage = () => JSON.parse(localStorage.getItem("projectsContainer"));
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



const testItem = todoItem.create(
    "cleaning",
    "bathrooms",
    "today",
    "low",
    "make sure to get the white wood thing",
    false,
    "oo figure out how to make checklist, maybe array", "does it work", "but now how do i know someone has checked off a todolist item"
    );

project.addItem(testItem, defaultProject);
project.addToProjectsContainer(defaultProject);
project.addToProjectsContainer(test1);
project.addToProjectsContainer(test2);
todoItem.checklist.addItem("test", testItem);
todoItem.checklist.convertToObjects(testItem);
todoItem.checklist.checkItem(0, testItem);
// todoItem.checklist.removeItem("test", testItem);
todoItem.markCompleted(testItem);
syncProjectsContainers(); 


let currentlySelectedProject = projectsContainer[0]; 
let currentlySelectedTodoItem = currentlySelectedProject.items[0];

const DOM = (() => {
    const contentDiv = document.querySelector("#content");

    const _createProjectButton = () => {
        const button = document.createElement("button");
        button.textContent = "Create New Project +";
        button.classList.add("createProject");
        return button;
    }


    const _addItemToSelectedProject = () => {
            // const thisProject = projectsContainer[index];
            const newItem = todoItem.create("Empty");
            project.addItem(newItem, currentlySelectedProject);
    }

    const _createTodoItemButton = () => {
        const button = document.createElement("button");
        button.textContent = "Add todo item+";
        button.classList.add("createTodoItem");
        return button
    }

    const _createProjectWithTodoItem = () => {
            const newProject = project.create("New Project Title");
            const newItem = todoItem.create("New Item Title");
            project.addToProjectsContainer(newProject);
            project.addItem(newItem, newProject);
            return newProject;
    }

    const _createTodoItemsDiv = () => {
        const div = document.createElement("div");
        const h1 = document.createElement("h1");
        h1.textContent = "Todo Items";
        div.appendChild(h1);
        div.classList.add("todoItemsContainer");
        return div;
    }

    const _createTodoItemContentDiv = () => {
        const div = document.createElement("div");
        div.classList.add("itemContentDisplay");
        return div;
    }

    const _displayTodoItems = () => {
        const todoContainer = document.querySelector(".todoItemsContainer");
        const ul = document.createElement("ul");
        ul.classList.add("todoItems");
        currentlySelectedProject.items.forEach(item => {
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
    }
    //add a way to create new checklist items, remove them too
    const _createChecklist = (item) => { 
        const ul = document.createElement("ul");
        for(let i = 0; i < item.checklist.length; i++) {
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

            if(currentChecklistItem.checked == true) {
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
    }

    const _getCurrentItemFromEvent = (event) => {
        const index = _getIndexOfElementFromEvent(event.currentTarget);
        const currentItem = currentlySelectedProject.items[index];
        return currentItem;
    } 

    const _displayTodoItemContents = (item) => {
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
        choosePriority.textContent = "Level of importance"
        itemPriorityLow.textContent = "Low";
        itemPriorityMedium.textContent = "Medium";
        itemPriorityHigh.textContent = "High";

        switch(item.priority) {
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
        
        itemPriority.append(choosePriority,itemPriorityLow, itemPriorityMedium, itemPriorityHigh);
        
        
        container.append(
            itemTitle,
            itemDescription,
            itemDueDate,
            itemPriority,
            itemNotes,
            _createChecklist(item),
        );

    }

    const _updatePriorityIndicator = () => {
        const indicators = document.querySelectorAll(".priorityIndicator");
        for(let i = 0; i < indicators.length; i++) {
            const currentIndicator = indicators[i];

            switch(currentlySelectedTodoItem.priority) {
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
                default: console.log(currentlySelectedTodoItem);
            }
        }
    }

    //todo: create a function that sets the text content of todo items to its corresponding object
    const _updateTodoItemValues = () => {
        const Inputs = document.querySelectorAll(".itemContentDisplay > *");
            console.log(Inputs)
            const title = Inputs[0].value;
            const description = Inputs[1].value;
            const dueDate = Inputs[2].value;
            let priority = Inputs[3].childNodes;
            const notes = Inputs[4].value;
            const checklist = Inputs[5].childNodes;
            console.log(description)

            // sets priority value
            for(const option of priority) {
                if(option.selected == true) priority = option.textContent.toLowerCase();
            }

            currentlySelectedTodoItem.title = title;
            currentlySelectedTodoItem.description = description;
            currentlySelectedTodoItem.dueDate = dueDate;
            currentlySelectedTodoItem.priority = priority;
            currentlySelectedTodoItem.notes = notes;

            for(let i = 0; i < checklist.length; i++) {
                const itemName = checklist[i].childNodes[1].value;
                const itemCheckedStatus = checklist[i].childNodes[0].checked;

                //sets checklist item names and checked status
                currentlySelectedTodoItem.checklist[i].checked = itemCheckedStatus; 
                currentlySelectedTodoItem.checklist[i].checklistItemName = `${itemName}`;
            }
    }
    
    const _getIndexOfElementFromEvent = (eventTargetChild) => {
        // const siblings = [...event.target.parentNode.parentNode.children]; 
        // const targetChild = event.target.parentNode;
        // const siblings = [...event.currentTarget.parentNode.children]; 
        // const targetChild = event.currentTarget;
        const siblings = [...eventTargetChild.parentNode.children]; 
        const targetChild = eventTargetChild;
        const index = siblings.indexOf(targetChild);
        console.log({targetChild, siblings, index});
        return index;
    }

    const _removeItemContentsfromDisplay = () => {
        const itemContents = () => document.querySelectorAll(".itemContentDisplay > *");
        if(itemContents() == null) {
            console.log("items not found");
        } else {
            for(const item of itemContents()) {
                item.remove();
            }
        }
    }
    
    const _todoItems = () => document.querySelectorAll(".todoItems");

    const _removeTodoItems = () => {
        _todoItems().forEach(item => item.remove());
    }


    const _createProjectsDiv = () => {
        const div = document.createElement("div");
        div.classList.add("projectsContainer");
        const h1 = document.createElement("h1");
        h1.textContent = "Your Projects";
        div.appendChild(h1);
        return div;
    }

    const _projectsOnDisplay = () => document.querySelectorAll(".projectsContainer > .project");

    const _clearProjectsOnDisplay = () => {
        _projectsOnDisplay().forEach(project => project.remove());
    }

    const _displayProjects = () => {
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
    }
    const _createDeleteButton = () => {
        const button = document.createElement("button");
        button.textContent = "Delete";
        button.classList.add("deleteButton");
        return button;
    }

    const _setCurrentlySelectedProject = (project) => {
            currentlySelectedProject = project;
    }

    const _addCurrentlySelectedClass = (classReceiver) => {
        classReceiver.classList.add("currentlySelected");
    }

    const _removeCurrentlySelectedClass = (classHolder) => {
        classHolder.classList.remove("currentlySelected");
    }

    const _getCurrentlySelectedClassHolder = (querySelector) => document.querySelector(querySelector);

    const _removeCurrentlySelectedClassFromHolder = (querySelector) => {
        if(_getCurrentlySelectedClassHolder(querySelector)) {
            _removeCurrentlySelectedClass(_getCurrentlySelectedClassHolder(querySelector));
        } else new Error("No currently selected class holder found");
    }

    const _addEventListenersToProjects = () => {
        _projectsOnDisplay().forEach(project => {
            project.addEventListener("click", (event) => {
                setProjectsContainerFromStorage();
                // this solution below is more robust because I wont have to re Index everytime i clear projects. 
                const index = (_getIndexOfElementFromEvent(event.currentTarget)) - 1;  //-1 because header is included in parent element
                console.log({index})
                _setCurrentlySelectedProject(projectsContainer[index]);
                _removeTodoItems();
                _removeItemContentsfromDisplay();
                console.log({currentlySelectedProject});
                _setCurrentTodoItemToFirstItemOfCurrentProject();
                _displayTodoItems();
                _displayFirstItemContent(currentlySelectedProject);
                _addEventListenersToTodoItems();
                _addEventListenersToChecklistButtons();
                _updatePriorityIndicator();
                _handleDeleteButtonsForProjects(event);
                _removeCurrentlySelectedClassFromHolder(".currentlySelected.project");
                _addCurrentlySelectedClass(event.currentTarget);
                
            });

            const projectTitleTextarea = project.childNodes[0];
            project.addEventListener("dblclick", () => projectTitleTextarea.readOnly = false);

            project.addEventListener("focusout", () => {
                projectTitleTextarea.readOnly = true;
                currentlySelectedProject.title = projectTitleTextarea.value;
            });
        });
    }
    const _handleDeleteButtonsForProjects = (event) => {
        if(isLast(_projectsOnDisplay()) == false) {
            
            if(event.target.classList == "deleteButton") {
                const index = (_getIndexOfElementFromEvent(event.currentTarget)) - 1;  //-1 because header is included in parent element
                console.log(index)
                project.removeFromProjectsContainer(projectsContainer[index]);
                setProjectsContainerFromStorage();
                _clearProjectsOnDisplay();
                _displayProjects();
                _addEventListenersToProjects();
                _setCurrentlySelectedProject(projectsContainer[0]);
            }
        } else throw Error("Cant delete last project");
    } 


    const _addEventListenersToTodoItems = () => {
        const todoItems = document.querySelectorAll(".todoItemListItem");
        for(let i = 0; i < todoItems.length; i++) {
            todoItems[i].addEventListener("click", (event) => {
                _removeItemContentsfromDisplay();
                currentlySelectedTodoItem = _getCurrentItemFromEvent(event);
                console.log({currentlySelectedTodoItem});
                _displayTodoItemContents(currentlySelectedTodoItem);
                _addEventListenersToChecklistButtons();
                _handleDeleteButtonsForTodoItems(event);
            });
        }
    }
    
    const _handleDeleteButtonsForTodoItems = (event) => {
        const _getListItems = () => document.querySelectorAll("li.todoItemListItem");
        if(isLast(_getListItems()) == false) {

            if(event.target.classList == "deleteButton") {
                const index = _getIndexOfElementFromEvent(event.currentTarget);
                project.removeItem(currentlySelectedProject.items[index], currentlySelectedProject);
                _getListItems()[index].remove();
                setProjectsContainerFromStorage();
                
            }
        } else throw Error("Cant delete last item");
    }
    const _addEventListenerToTodoItemButton = (event) => {
        const button = document.querySelector(".createTodoItem");
        button.addEventListener("click", (event) => {
            _addItemToSelectedProject();
            _removeTodoItems()
            _displayTodoItems(event);
            _addEventListenersToTodoItems(event);
            setProjectsContainerFromStorage();
        });
    }

    const _addEventListenerToProjectButton = () => {
        const button = document.querySelector(".createProject")
        button.addEventListener("click", () => {
            _setCurrentlySelectedProject(
                _createProjectWithTodoItem()
            );
            setProjectsContainerFromStorage();
            console.log({projectsContainer});
            _clearProjectsOnDisplay();
            _displayProjects();
            _addEventListenersToProjects();
        });
    }

    const _addEventListenersToChecklistButtons = () => {
        const removeButtons = document.querySelectorAll(".checklistItem .remove");
        const handleRemoveButtons = (event) => {
                const checklist = event.currentTarget.parentNode.parentNode;
                if(checklist.childElementCount != 1) {
                    // _updateTodoItemValues();
                    const itemForRemovalIndex = _getIndexOfElementFromEvent(event.currentTarget.parentNode);
                    console.log(itemForRemovalIndex);
                    todoItem.checklist.removeItem(itemForRemovalIndex, currentlySelectedTodoItem);
                    _removeItemContentsfromDisplay();
                    _displayTodoItemContents(currentlySelectedTodoItem);
                    _addEventListenersToChecklistButtons();
                    setProjectsContainerFromStorage();
                 }
        }

        for(let i = 0; i < removeButtons.length; i++) {
            removeButtons[i].addEventListener("click", (event) => handleRemoveButtons(event));
        }

        const addButtons = document.querySelectorAll(".checklistItem .add");
        
        const _handleAddButtons = () => {
            const newChecklistItem = todoItem.checklist.createItem("Create a checklist item here");
            todoItem.checklist.addItem(newChecklistItem, currentlySelectedTodoItem);
            _removeItemContentsfromDisplay();
            _displayTodoItemContents(currentlySelectedTodoItem);
            _addEventListenersToChecklistButtons();
            setProjectsContainerFromStorage();
        }

        for(let i = 0; i < addButtons.length; i++) {
            addButtons[i].addEventListener("click", _handleAddButtons);
        }
    }

    const _addEventListenersToItemContent = () => {
        const itemContent = document.querySelector(".itemContentDisplay");
            itemContent.addEventListener("change", (event) => {
                _updateTodoItemValues();
                setProjectsContainerFromStorage();
                const titleTextarea = 0;
                if(_getIndexOfElementFromEvent(event.target) == titleTextarea){
                    _removeTodoItems();
                    _displayTodoItems();
                    _addEventListenersToTodoItems();
                } 
        });
        
    }

    const _displayFirstItemContent = (project) => {
        const firstItem = project.items[0];
        _displayTodoItemContents(firstItem);
    }

    const _setCurrentTodoItemToFirstItemOfCurrentProject = () => {
        currentlySelectedTodoItem = currentlySelectedProject.items[0];
    }

    const load = () => {
        contentDiv.append(
            _createProjectButton(),
            _createTodoItemButton(),
            _createProjectsDiv(),
            _createTodoItemsDiv(),
            _createTodoItemContentDiv(),
        );
        setProjectsContainerFromStorage();
        _displayProjects();
        _displayTodoItems();
        _displayFirstItemContent(currentlySelectedProject);
        _updatePriorityIndicator();
        _addCurrentlySelectedClass(_projectsOnDisplay()[0]);
        _addEventListenersToProjects();
        _addEventListenersToTodoItems();
        _addEventListenerToTodoItemButton();
        _addEventListenerToProjectButton();
        _addEventListenersToChecklistButtons();
        _addEventListenersToItemContent();
    }

    return {
        load
    }

})();

DOM.load();
//todo: add remove button to projects and todo items. 
//todo: add selected classes to currentItems and CurrentProjects