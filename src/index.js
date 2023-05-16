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
console.log({test1, test2})
const projectsContainer = [];

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
console.log(projectsContainer[0]);
console.log(projectsContainer);
console.log({defaultProject, projectsContainer});
todoItem.markCompleted(testItem);


let currentlySelectedProject = defaultProject; 
let currentlySelectedTodoItem;

const DOM = (() => {
    const contentDiv = document.querySelector("#content");

    const createProjectButton = () => {
        const button = document.createElement("button");
        button.textContent = "Create New Project +";
        button.classList.add("createProject");
        return button;
    }

    const addEventListenerToProjectButton = () => {
        const button = document.querySelector(".createProject")
        button.addEventListener("click", () => {
            const tempProject = project.create(prompt("title"))
            project.addToProjectsContainer(tempProject);
            console.log({projectsContainer});
            clearProjectsOnDisplay();
            displayProjects();
            addEventListenersToProjects();
            setProjectIndexes();
        });
    }

    const addItemToSelectedProject = () => {
            // const index = +e.target.parentNode.dataset.index;
            // const thisProject = projectsContainer[index];
            const newItem = todoItem.create(prompt("title"));
            project.addItem(newItem, currentlySelectedProject);
    }

    const createTodoItemButton = () => {
        const button = document.createElement("button");
        button.textContent = "Add todo item+";
        button.classList.add("createTodoItem");
        return button
    }

    const addEventListenerToTodoItemButton = (e) => {
        const button = document.querySelector(".createTodoItem");
        button.addEventListener("click", (e) => {
            addItemToSelectedProject();
            removeTodoItems()
            displayTodoItems(e);
            addEventListenersToTodoItems(e);
        });
    }

    const createTodoItemsDiv = () => {
        const div = document.createElement("div");
        const h1 = document.createElement("h1");
        h1.textContent = "Todo Items";
        div.appendChild(h1);
        div.classList.add("todoItemsContainer");
        return div;
    }

    const createTodoItemContentDiv = () => {
        const div = document.createElement("div");
        div.classList.add("ItemContentDisplay");
        return div;
    }


    const displayTodoItems = () => {
        const todoContainer = document.querySelector(".todoItemsContainer");
        const ul = document.createElement("ul");
        ul.classList.add("todoItems");
        
        currentlySelectedProject.items.forEach(item => {
            const li = document.createElement("li");
            const h3 = document.createElement("h3");

            li.classList.add("todoItemListItem");
            h3.textContent = `Title: ${item.title} Due: ${item.dueDate}`;
            li.append(h3)
            ul.append(li); 
        });
        todoContainer.appendChild(ul);
    }
    //add a way to create new checklist items, remove them too
    const createChecklist = (item) => { 
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

    const displayChecklistItemLi = (checklistItem) => {
            const li = document.createElement("li");
            const textarea = document.createElement("textarea");
            const input = document.createElement("input");
            const addChecklistItemButtom = document.createElement("button");
            const removeChecklistItemButton = document.createElement("button");

            addChecklistItemButtom.textContent = "+";
            removeChecklistItemButton.textContent = "-";
            input.type = "checkbox";
            textarea.textContent = `${checklistItem.checklistItemName}`;
            addChecklistItemButtom.classList.add("add");
            removeChecklistItemButton.classList.add("remove");
            li.classList.add("checklistItem");

            
            li.append(
                input,
                textarea,
                addChecklistItemButtom,
                removeChecklistItemButton
            );
            
            const container = document.querySelector("ul.checklist");
            container.append(li);
    }


    const addEventListenersToChecklistButtons = () => {
        const removeButtons = document.querySelectorAll(".checklistItem .remove");

        for(let i = 0; i < removeButtons.length; i++) {
            removeButtons[i].addEventListener("click", (event) => {
                const itemForRemovalIndex = getIndexOfElementFromEvent(event);
                todoItem.checklist.removeItem(itemForRemovalIndex, currentlySelectedTodoItem);
                removeItemContentsfromDisplay();
                displayTodoItemContents(currentlySelectedTodoItem);
                addEventListenersToChecklistButtons();
            });
        }

        const addButtons = document.querySelectorAll(".checklistItem .add");

        for(let i = 0; i < addButtons.length; i++) {
            addButtons[i].addEventListener("click", (event) => {
                const index = getIndexOfElementFromEvent(event);
                console.log(index);
                const newChecklistItem = todoItem.checklist.createItem("");
                todoItem.checklist.addItem(newChecklistItem, currentlySelectedTodoItem);
                displayChecklistItemLi(newChecklistItem);
                console.log(currentlySelectedTodoItem);
                addEventListenersToChecklistButtons();
            });
        }
    }

    const addEventListenersToCheckboxes = () => {
        const checkboxes = document.querySelectorAll(".checklistItem > [type=checkbox]");

        for(let i = 0; i < checkboxes.length; i++) {
            const currentCheckbox = checkboxes[i]; 
            currentCheckbox.addEventListener("click", (event) => {
            const index = getIndexOfElementFromEvent(event);
            
            if(currentCheckbox.checked == true) {
                todoItem.checklist.checkItem(index,currentlySelectedTodoItem);
                console.log(currentlySelectedTodoItem)
            } else if (currentCheckbox.checked == false) {
                todoItem.checklist.uncheckItem(index,currentlySelectedTodoItem);
            } else console.log("could not find checkbox");
            });
        }
        console.log(checkboxes);
    }

    const getCurrentItemFromEvent = (event) => {
        const index = getIndexOfElementFromEvent(event);
        const currentItem = currentlySelectedProject.items[index];
        return currentItem;
    } 

    const displayTodoItemContents = (item) => {
        const container = document.querySelector(".ItemContentDisplay");
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
            createChecklist(item),
        );

    }

    //todo: create a function that sets the text content of todo items to its corresponding object
    const updateTodoItemValues = () => {

    }

    
    const getIndexOfElementFromEvent = (event) => {
        const siblings = [...event.target.parentNode.parentNode.children]; 
        const targetChild = event.target.parentNode;
        return siblings.indexOf(targetChild);
    }

    const removeItemContentsfromDisplay = () => {
        const itemContents = () => document.querySelectorAll(".ItemContentDisplay > *");
        if(itemContents() == null) {
            console.log("items not found");
        } else {
            for(const item of itemContents()) {
                item.remove();
            }
            console.log("items removed");
        }
    }

    let currentlySelectedTodoItem = currentlySelectedProject.items[0];

    const addEventListenersToTodoItems = () => {
        const todoItems = document.querySelectorAll(".todoItemListItem");
        for(let i = 0; i < todoItems.length; i++) {
            todoItems[i].addEventListener("click", (event) => {
                    removeItemContentsfromDisplay();
                    currentlySelectedTodoItem = getCurrentItemFromEvent(event);
                    console.log(currentlySelectedTodoItem);
                    displayTodoItemContents(getCurrentItemFromEvent(event));
            });
        }
    }
    
    const todoItems = () => document.querySelectorAll(".todoItems");

    const removeTodoItems = () => {
        todoItems().forEach(item => item.remove());
    }


    const setProjectIndexes = () => {
        for(let i = 0; i < projectsOnDisplay().length; i++) {
            projectsOnDisplay()[i].dataset.index = `${i}`;
        }
    }

    const createProjectsDiv = () => {
        const div = document.createElement("div");
        div.classList.add("projectsContainer");
        const h1 = document.createElement("h1");
        h1.textContent = "Your Projects";
        div.appendChild(h1);
        return div;
    }

    const projectsOnDisplay = () => document.querySelectorAll(".projectsContainer > .project");

    const clearProjectsOnDisplay = () => {
        projectsOnDisplay().forEach(project => project.remove());
    }

    const displayProjects = () => {
        const container = document.querySelector(".projectsContainer");
        projectsContainer.forEach((project) => {
            const div = document.createElement("div");
            const h2 = document.createElement("h2");

            h2.textContent = `${project.title}`;
            div.classList.add("project");

            div.appendChild(h2);
            container.appendChild(div);
        });
    }

    const setSelectedProject = (e) => {
        const index = +e.target.parentNode.dataset.index;
        const thisProject =  projectsContainer[index];
        currentlySelectedProject = thisProject; 
        console.log({currentlySelectedProject});
    }



    const addEventListenersToProjects = () => {
        projectsOnDisplay().forEach(project => {
            project.addEventListener("click", (event) => {
                    setSelectedProject(event);
                    removeItemContentsfromDisplay();
                    displayFirstItemContent(currentlySelectedProject);
                    setCurrentTodoItemToFirstItemOfCurrentProject();
                    removeTodoItems();
                    displayTodoItems(event);
                    addEventListenersToTodoItems();
                    addEventListenersToChecklistButtons();
                    addEventListenersToCheckboxes();
            })
        })
    }

    const displayFirstItemContent = (project) => {
        const firstItem = project.items[0];
        displayTodoItemContents(firstItem);
    }

    const setCurrentTodoItemToFirstItemOfCurrentProject = () => {
        currentlySelectedTodoItem = currentlySelectedProject.items[0];
    }


    const load = () => {
        contentDiv.append(
            createProjectButton(),
            createTodoItemButton(),
            createProjectsDiv(),
            createTodoItemsDiv(),
            createTodoItemContentDiv(),
        );
        displayProjects();
        setProjectIndexes();
        displayTodoItems();
        displayFirstItemContent(currentlySelectedProject);
        addEventListenersToProjects();
        addEventListenerToTodoItemButton();
        addEventListenerToProjectButton();
        addEventListenersToChecklistButtons();
        addEventListenersToCheckboxes();
    }

    return {
        load
    }

})();

DOM.load();