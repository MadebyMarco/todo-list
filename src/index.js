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
    const create = (title, description, dueDate, priority, notes, completed, ...checklist) => {
    
    
        return  {
            title,
            description,
            dueDate,
            priority,
            notes,
            completed,
            checklist,
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
todoItem.checklist.addItem("test", testItem);
todoItem.checklist.convertToObjects(testItem);
todoItem.checklist.checkItem(0, testItem);
// todoItem.checklist.removeItem("test", testItem);
console.log(projectsContainer[0]);
console.log(projectsContainer);
console.log({defaultProject, projectsContainer});
todoItem.markCompleted(testItem);

const DOM = (() => {
    const contentDiv = document.querySelector("#content");
    let currentlySelectedProject = defaultProject; 

    const createProjectButton = () => {
        const button = document.createElement("button");
        button.textContent = "Create New Project +";
        button.classList.add("createProject");

        button.addEventListener("click", () => {
            const tempProject = project.create(prompt("title"))
            project.addToProjectsContainer(tempProject);
            console.log({projectsContainer});
            clearProjectsOnDisplay();
            displayProjects();
            addEventListenersToProjects();
            setProjectIndexes();
        });



        return button;
    }

    const createTodoItemButton = () => {
        const button = document.createElement("button");
        button.textContent = "Add todo item+";
        button.classList.add("createTodoItem");

        button.addEventListener("click", (e) => {
            const index = e.target.dataset.index;
            const thisProject = projectsContainer[index];
            const newItem = todoItem.create(prompt("title"));

            project.addItem(newItem, thisProject);
            
            console.log(thisProject);


        })


        return button
    }

    const createTodoItemsDiv = () => {
        const div = document.createElement("div");
        const h2 = document.createElement("h2");
        h2.textContent = "Todo Items";
        div.appendChild(h2);
        div.classList.add("todoItemsContainer");
        return div;
    }

    const displayTodoItems = (e) => {
        const index = +e.target.nextElementSibling.dataset.index;
        const todoContainer = document.querySelector(".todoItemsContainer");
        const ul = document.createElement("ul");
        ul.classList.add("todoItems");
        projectsContainer[index].items.forEach(item => {
                const li = document.createElement("li");
                li.textContent = `${item.title}`;
                ul.appendChild(li); 
        });
        todoContainer.appendChild(ul);
    }

    const displayChecklistItems = () =>{
            item.checklist.forEach(checklistItem => {
                const li = document.createElement("li");
                li.textContent = `${checklistItem.checklistItemName}`;
                ul.appendChild(li); 
            });
    }

    const setProjectIndexes = () => {
        for(let i = 0; i < projectsOnDisplay().length; i++) {
            projectsOnDisplay()[i].dataset.index = `${i}`;
        }
    }

    const createProjectsDiv = () => {
        const div = document.createElement("div");
        div.classList.add("projectsContainer");
        return div;
    }

    const projectsOnDisplay = () => document.querySelectorAll(".projectsContainer > *");

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
            div.appendChild(createTodoItemButton());
            container.appendChild(div);
        });
    }

    const addEventListenersToProjects = () => {
        projectsOnDisplay().forEach(project => {
            project.addEventListener("click", (e) => {
                displayTodoItems(e);
                console.log(e);
            })
        })
    }

    
    

    const load = () => {
        contentDiv.append(
            createProjectButton(),
            createProjectsDiv(),
            createTodoItemsDiv(),
        );
        displayProjects();
        addEventListenersToProjects();
        setProjectIndexes();
    }

    return {
        load
    }

})();

DOM.load();