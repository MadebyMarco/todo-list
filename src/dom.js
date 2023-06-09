import {project, 
    todoItem, 
    setProjectsContainerFromStorage, 
    getProjectsContainerFromStorage, 
    currentlySelectedProject, 
    currentlySelectedTodoItem, 
    projectsContainer, 
    setCurrentlySelectedProject, 
    setCurrentlySelectedTodoItem,
    setCurrentTodoItemToFirstItemOfCurrentProject, 
    addItemToCurrentlySelectedProject, 
    isLast
} from "./logic.js"; 

const DOM = (() => {
    const contentDiv = document.querySelector("#content");

    const _createProjectButton = () => {
        const button = document.createElement("button");
        button.textContent = "Create New Project +";
        button.classList.add("createProject");
        return button;
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
            const currentItem = currentlySelectedProject.items[i];
            currentIndicator.classList.remove("low", "medium", "high", "transparent");
            
            switch(currentItem.priority) {
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
                default: console.error("current item priority does not match");
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
    
    const _getTodoItemsContainer = () => document.querySelector(".todoItems");

    const _removeTodoItemsContainer = () => {
        _getTodoItemsContainer().remove();
    }

    const _getTodoItemsOnDisplay = () => document.querySelectorAll("li.todoItemListItem");


    const _createProjectsDiv = () => {
        const div = document.createElement("div");
        div.classList.add("projectsContainer");
        const h1 = document.createElement("h1");
        h1.textContent = "Your Projects";
        div.appendChild(h1);
        return div;
    }

    const _getProjectsOnDisplay = () => document.querySelectorAll(".projectsContainer > .project");

    const _clearProjectsOnDisplay = () => {
        _getProjectsOnDisplay().forEach(project => project.remove());
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
        _getProjectsOnDisplay().forEach(project => {
            project.addEventListener("click", (event) => {
                setProjectsContainerFromStorage();
                // this solution below is more robust because I wont have to re Index everytime i clear projects. 
                const index = (_getIndexOfElementFromEvent(event.currentTarget)) - 1;  //-1 because header is included in parent element
                console.log({index})
                setCurrentlySelectedProject(projectsContainer[index]);
                _removeTodoItemsContainer();
                _removeItemContentsfromDisplay();
                console.log({currentlySelectedProject});
                setCurrentTodoItemToFirstItemOfCurrentProject();
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
        if(isLast(_getProjectsOnDisplay()) == false) {
            
            if(event.target.classList == "deleteButton") {
                const index = (_getIndexOfElementFromEvent(event.currentTarget)) - 1;  //-1 because header is included in parent element
                console.log(index)
                project.removeFromProjectsContainer(projectsContainer[index]);
                setProjectsContainerFromStorage();
                _clearProjectsOnDisplay();
                _displayProjects();
                _addEventListenersToProjects();
                setCurrentlySelectedProject(projectsContainer[0]);
            }
        } else throw Error("Cant delete last project");
    } 


    const _addEventListenersToTodoItems = () => {
        const todoItems = document.querySelectorAll(".todoItemListItem");
        for(let i = 0; i < todoItems.length; i++) {
            todoItems[i].addEventListener("click", (event) => {
                _removeItemContentsfromDisplay();
                setCurrentlySelectedTodoItem(_getCurrentItemFromEvent(event));
                console.log({currentlySelectedTodoItem});
                _displayTodoItemContents(currentlySelectedTodoItem);
                _addEventListenersToChecklistButtons();
                _handleDeleteButtonsForTodoItems(event);
                _removeCurrentlySelectedClassFromHolder(".currentlySelected.todoItemListItem");
                _addCurrentlySelectedClass(event.currentTarget);
            });
        }
    }
    
    const _handleDeleteButtonsForTodoItems = (event) => {
        if(isLast(_getTodoItemsOnDisplay()) == false) {

            if(event.target.classList == "deleteButton") {
                const index = _getIndexOfElementFromEvent(event.currentTarget);
                project.removeItem(currentlySelectedProject.items[index], currentlySelectedProject);
                _getTodoItemsOnDisplay()[index].remove();
                setProjectsContainerFromStorage();
                
            }
        } else throw Error("Cant delete last item");
    }
    const _addEventListenerToTodoItemButton = (event) => {
        const button = document.querySelector(".createTodoItem");
        button.addEventListener("click", (event) => {
            addItemToCurrentlySelectedProject();
            _removeTodoItemsContainer()
            _displayTodoItems(event);
            _addEventListenersToTodoItems(event);
            setProjectsContainerFromStorage();
        });
    }

    const _addEventListenerToProjectButton = () => {
        const button = document.querySelector(".createProject")
        button.addEventListener("click", () => {
            setCurrentlySelectedProject(
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
                _updatePriorityIndicator();
                setProjectsContainerFromStorage();
                const titleTextarea = 0;
                if(_getIndexOfElementFromEvent(event.target) == titleTextarea){
                    _removeTodoItemsContainer();
                    _displayTodoItems();
                    _addEventListenersToTodoItems();
                } 
        });
        
    }

    const _displayFirstItemContent = (project) => {
        const firstItem = project.items[0];
        _displayTodoItemContents(firstItem);
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
        _addCurrentlySelectedClass(_getProjectsOnDisplay()[0]);
        _addCurrentlySelectedClass(_getTodoItemsOnDisplay()[0]);
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

export {DOM};