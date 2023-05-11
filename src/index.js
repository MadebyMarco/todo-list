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
    
    
        return  {
            title, //input text
            description, //input text
            dueDate, //date
            priority, //radio buttons
            notes, //input field or text 
            completed, // radio button
            checklist, //tbd
        }
    }

// Making the checklist conversion into a separate function instead of a todoItem property/interal job
// by making items on my check list objects with two keys, name & checked, I can store store and render the info easily.
// I need to make every input into checklist an object. I can forEach over and set name to whatever is in checklist.

    const checklist = (() => {

    //need to find a way to check a list item
    //First I will search through a todoItem's checklist using the listItems index
        const checkItem = (listItemIndex, todoItem) => {
            todoItem.checklist[listItemIndex].checked = true;
        }
        
        const uncheckItem = (listItemIndex, todoItem) => {
            todoItem.checklist[listItemIndex].checked = false;
        }

        const convertToObjects = (todoItem) => {
            const objectChecklist = [];
            todoItem.checklist.forEach(item => {

                if (!item.isObject) { //wont nest objects
                    const itemObject = {checklistItemName: `${item}`, checked: false};
                    objectChecklist.push(itemObject);
                }

            });
        
            todoItem.checklist = objectChecklist;
        }

        // const convertToObject = (item, todoItem) => {
        //     item = {checklistItemName: `${item}`, checked: false};
        // }

        const addItem = (checklistItem, todoItem) => {
            todoItem.checklist.push(checklistItem);
        }

        const removeItem = (checkListItem, todoItem) => {
            const index = todoItem.checklist.findIndex(item => item.checklistItemName == checkListItem);
            todoItem.checklist.splice(index, 1);
        }

        return {
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

    const createChecklist = (item) => { 
        const ul = document.createElement("ul");
        for(let i = 0; i < item.checklist.length; i++) {
            const li = document.createElement("li");
            const container = document.createElement("div");
            const textarea = document.createElement("textarea");
            const input = document.createElement("input");
            const currentChecklistItem = item.checklist[i];

            input.type = "checkbox";
            textarea.textContent = `${currentChecklistItem.checklistItemName}`;
            
            if(currentChecklistItem.checked == true) {
                input.checked = true;
            } else input.checked = false;
            
            container.append(
                input,
                textarea,
                    );
            li.append(container);
            ul.append(li);
        }
        return ul;
    }
    const getCurrentItemFromEvent = (event) => {
        const index = getIndexOfElementFromEvent(event);
        const currentItem = currentlySelectedProject.items[index];
        return currentItem;
    } 
    const displayTodoItemContents = (item) => {
        const container = document.createElement("div");
        const itemTitle = document.createElement("textarea");
        const itemDescription = document.createElement("textarea");
        const itemDueDate = document.createElement("textarea");
        const itemPriority = document.createElement("input");
        const itemNotes = document.createElement("textarea");
        console.log(item.checklist)
        
        itemTitle.textContent = `${item.title}`;
        itemDescription.textContent = `${item.description}`; 
        itemDueDate.textContent = `${item.dueDate}`; 
        itemPriority.value = `${item.priority}`;
        itemPriority.type = "range";
        itemNotes.textContent = `${item.notes}`;
        
        // container.classList.add("ItemContentDisplay");
        container.append(
            itemTitle,
            itemDescription,
            itemDueDate,
            itemPriority,
            itemNotes,
            createChecklist(item),
        );
        // const todoItems = () => document.querySelectorAll(".todoItemListItem");

        // todoItems()[index].append(container);
        const display = document.querySelector(".ItemContentDisplay");
        display.append(container);
    }
    
    const getIndexOfElementFromEvent = (event) => {
        const siblings = [...event.target.parentNode.parentNode.children]; 
        const targetChild = event.target.parentNode;
        console.log(targetChild)
        return siblings.indexOf(targetChild);
    }

    const removeItemContentsfromDisplay = () => {
        const itemContents = () => document.querySelector(".ItemContentDisplay > *");
        if(itemContents() == null) {
        } else itemContents().remove();
    }


    const addEventListenersToTodoItems = () => {
        const todoItems = document.querySelectorAll(".todoItemListItem");
        for(let i = 0; i < todoItems.length; i++) {
            todoItems[i].addEventListener("click", (e) => {
                    removeItemContentsfromDisplay();
                    displayTodoItemContents(getCurrentItemFromEvent(e));
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
            project.addEventListener("click", (e) => {
                    setSelectedProject(e);
                    removeItemContentsfromDisplay();
                    displayFirstItemContent(currentlySelectedProject);
                    removeTodoItems();
                    displayTodoItems(e);
                    addEventListenersToTodoItems();
            })
        })
    }

    const displayFirstItemContent = (project) => {
        const firstItem = project.items[0];
        displayTodoItemContents(firstItem);
    }


    const createTodoItemForm = () => {
        const form = document.createElement("form");
            form.classList.add("createTodoItemForm")

        const h1 = document.createElement("h1");
            h1.textContent = "Create your item";

        const inputTitle = document.createElement("input");
            inputTitle.classList.add("title");
        
        const inputDescription = document.createElement("input");
            inputDescription.classList.add("description");

        const inputDate = document.createElement("input");
            inputDate.classList.add("date");

        const inputProrityHigh = document.createElement("input");
            inputProrityHigh.type = "checkbox";
            inputProrityHigh.classList.add("priority");
        const inputProrityMedium = document.createElement("input");
            inputProrityMedium.type = "checkbox";
            inputProrityMedium.classList.add("priority");
        const inputProrityLow = document.createElement("input");
            inputProrityLow.type = "checkbox";
            inputProrityLow.classList.add("priority");

        const inputCompleteStatus = document.createElement("input");
            inputCompleteStatus.classList.add("completeStatus");

        const inputChecklist = document.createElement("input");
            inputChecklist.classList.add("checklist");

        const inputCreateButton = document.createElement("input")
            inputCreateButton.type = "button";
            inputCreateButton.value = "Create Item +"
            inputCreateButton.classList.add("create");

        form.append(
                h1,
                inputTitle,
                inputDescription,
                inputDate,
                inputProrityLow,
                inputProrityMedium,
                inputProrityHigh,
                inputCompleteStatus,
                inputChecklist,
                inputCreateButton,
        );

            return form;
    }
    
    const createProjectForm = () => {
        const form = document.createElement("form");
            form.classList.add("createProjectForm");
        
        const h1 = document.createElement("h1");
            h1.textContent = "Create your project";

        const inputTitle = document.createElement("input");
            inputTitle.classList.add("title");
        
        form.append(
            h1,
            inputTitle
        );

        return form;
    } 

    const load = () => {
        contentDiv.append(
            createProjectButton(),
            createTodoItemButton(),
            createProjectsDiv(),
            createTodoItemsDiv(),
            createTodoItemContentDiv(),
            // createTodoItemForm(),
            // createProjectForm(),
        );
        displayProjects();
        addEventListenersToProjects();
        addEventListenerToTodoItemButton();
        addEventListenerToProjectButton();
        setProjectIndexes();
        displayTodoItems();
        displayFirstItemContent(currentlySelectedProject);
    }

    return {
        load
    }

})();

DOM.load();