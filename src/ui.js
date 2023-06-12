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
        document.body.addEventListener("click", handleClickOnBody)
    }

    function handleClickOnBody(event) {
        if(event.target.nodeName == "BUTTON" && event.target.classList.contains("remove")) {
            console.log("button removal")
        }
    }
    addEventListenerToBody();

    
    const addEventListenersToChecklistButtons = () => {
        const removeButtons = document.querySelectorAll(".checklistItem .remove");
        const handleRemoveButtons = (event) => {
                const checklist = document.querySelector(".checklist");
                if(checklist.childElementCount != 1) {
                    const itemForRemovalIndex = getIndexOfElementFromEvent(event.currentTarget.parentNode);
                    todoItem.checklist.removeItem(itemForRemovalIndex, currentlySelectedTodoItem);
                    DOM.removeItemContentsfromDisplay();
                    DOM.displayTodoItemContents(currentlySelectedTodoItem);
                    addEventListenersToChecklistButtons();
                    setProjectsContainerFromStorage();
                 } else console.error("Cant delete last checklist item");
        }

        for(let i = 0; i < removeButtons.length; i++) {
            removeButtons[i].addEventListener("click", (event) => handleRemoveButtons(event));
        }

        const addButtons = document.querySelectorAll(".checklistItem .add");
        
        const _handleAddButtons = () => {
            const newChecklistItem = todoItem.checklist.createItem("Create a checklist item here");
            todoItem.checklist.addItem(newChecklistItem, currentlySelectedTodoItem);
            DOM.removeItemContentsfromDisplay();
            DOM.displayTodoItemContents(currentlySelectedTodoItem);
            addEventListenersToChecklistButtons();
            setProjectsContainerFromStorage();
        }

        for(let i = 0; i < addButtons.length; i++) {
            addButtons[i].addEventListener("click", _handleAddButtons);
        }
    }

    const _addEventListenersToProjects = () => {
        DOM.getProjectsOnDisplay().forEach(project => {
            project.addEventListener("click", (event) => {
                setProjectsContainerFromStorage();
                // this solution below is more robust because I wont have to re Index everytime i clear projects. 
                const index = (getIndexOfElementFromEvent(event.currentTarget)) - 1;  //-1 because header is included in parent element
                console.log({index})
                setCurrentlySelectedProject(projectsContainer[index]);
                DOM.removeTodoItemsContainer();
                DOM.removeItemContentsfromDisplay();
                console.log({currentlySelectedProject});
                setCurrentTodoItemToFirstItemOfCurrentProject();
                DOM.displayTodoItems();
                DOM.displayFirstItemContent(currentlySelectedProject);
                _addEventListenersToTodoItems();
                addEventListenersToChecklistButtons();
                DOM.updatePriorityIndicator();
                _handleDeleteButtonsForProjects(event);
                DOM.removeCurrentlySelectedClassFromHolder(".currentlySelected.project");
                DOM.addCurrentlySelectedClass(event.currentTarget);
                
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
        if(event.target.classList.contains("deleteButton")) {
            if(isLast(DOM.getProjectsOnDisplay()) == false) {
                const index = (getIndexOfElementFromEvent(event.currentTarget)) - 1;  //-1 because header is included in parent element
                console.log(index);
                project.removeFromProjectsContainer(projectsContainer[index]);
                setProjectsContainerFromStorage();
                DOM.clearProjectsOnDisplay();
                DOM.displayProjects();
                _addEventListenersToProjects();
                setCurrentlySelectedProject(projectsContainer[0]);
            }else throw Error("Cant delete last project");
        } 
    } 


    const _addEventListenersToTodoItems = () => {
        const todoItems = document.querySelectorAll(".todoItemListItem");
        for(let i = 0; i < todoItems.length; i++) {
            todoItems[i].addEventListener("click", (event) => {
                DOM.removeItemContentsfromDisplay();
                setCurrentlySelectedTodoItem(getCurrentItemFromEvent(event));
                console.log({currentlySelectedTodoItem});
                DOM.displayTodoItemContents(currentlySelectedTodoItem);
                addEventListenersToChecklistButtons();
                _handleDeleteButtonsForTodoItems(event);
                DOM.removeCurrentlySelectedClassFromHolder(".currentlySelected.todoItemListItem");
                DOM.addCurrentlySelectedClass(event.currentTarget);
            });
        }
    }
    
    const _handleDeleteButtonsForTodoItems = (event) => {
        if(event.target.classList.contains("deleteButton")) {
            if(isLast(DOM.getTodoItemsOnDisplay()) == false) {

                const index = getIndexOfElementFromEvent(event.currentTarget);
                project.removeItem(currentlySelectedProject.items[index], currentlySelectedProject);
                DOM.getTodoItemsOnDisplay()[index].remove();
                setProjectsContainerFromStorage();
                
            } else throw Error("Cant delete last item");
        }
    }
    const _addEventListenerToTodoItemButton = (event) => {
        const button = document.querySelector(".createTodoItem");
        button.addEventListener("click", (event) => {
            addItemToCurrentlySelectedProject();
            DOM.removeTodoItemsContainer()
            DOM.displayTodoItems(event);
            _addEventListenersToTodoItems(event);
            setProjectsContainerFromStorage();
        });
    }

    const _addEventListenerToProjectButton = () => {
        const button = document.querySelector(".createProject")
        button.addEventListener("click", () => {
            setCurrentlySelectedProject(
                DOM.createProjectWithTodoItem()
            );
            setProjectsContainerFromStorage();
            console.log({projectsContainer});
            DOM.clearProjectsOnDisplay();
            DOM.displayProjects();
            _addEventListenersToProjects();
        });
    }


    const _addEventListenersToItemContent = () => {
        const itemContent = document.querySelector(".itemContentDisplay");
            itemContent.addEventListener("change", (event) => {
                DOM.updateTodoItemValues();
                DOM.updatePriorityIndicator();
                setProjectsContainerFromStorage();
                const titleTextarea = 0;
                if(getIndexOfElementFromEvent(event.target) == titleTextarea){
                    DOM.removeTodoItemsContainer();
                    DOM.displayTodoItems();
                    _addEventListenersToTodoItems();
                } 
        });
        
    }

    function addEventListeners() {
        _addEventListenersToProjects();
        _addEventListenersToTodoItems();
        _addEventListenerToTodoItemButton();
        _addEventListenerToProjectButton();
        addEventListenersToChecklistButtons();
        _addEventListenersToItemContent();
    }

    export {addEventListeners}