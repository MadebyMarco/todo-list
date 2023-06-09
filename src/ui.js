    import { 
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
    isLast
    } from "./logic";
    import { DOM } from "./dom";

    const addEventListenersToChecklistButtons = () => {
        const removeButtons = document.querySelectorAll(".checklistItem .remove");
        const handleRemoveButtons = (event) => {
                const checklist = event.currentTarget.parentNode.parentNode;
                if(checklist.childElementCount != 1) {
                    // _updateTodoItemValues();
                    const itemForRemovalIndex = getIndexOfElementFromEvent(event.currentTarget.parentNode);
                    console.log(itemForRemovalIndex);
                    todoItem.checklist.removeItem(itemForRemovalIndex, currentlySelectedTodoItem);
                    DOM.removeItemContentsfromDisplay();
                    _displayTodoItemContents(currentlySelectedTodoItem);
                    addEventListenersToChecklistButtons();
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
            DOM.removeItemContentsfromDisplay();
            _displayTodoItemContents(currentlySelectedTodoItem);
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
        if(isLast(DOM.getProjectsOnDisplay()) == false) {
            
            if(event.target.classList == "deleteButton") {
                const index = (getIndexOfElementFromEvent(event.currentTarget)) - 1;  //-1 because header is included in parent element
                console.log(index);
                project.removeFromProjectsContainer(projectsContainer[index]);
                setProjectsContainerFromStorage();
                _clearProjectsOnDisplay();
                DOM.displayProjects();
                _addEventListenersToProjects();
                setCurrentlySelectedProject(projectsContainer[0]);
            }
        } else throw Error("Cant delete last project");
    } 


    const _addEventListenersToTodoItems = () => {
        const todoItems = document.querySelectorAll(".todoItemListItem");
        for(let i = 0; i < todoItems.length; i++) {
            todoItems[i].addEventListener("click", (event) => {
                DOM.removeItemContentsfromDisplay();
                setCurrentlySelectedTodoItem(getCurrentItemFromEvent(event));
                console.log({currentlySelectedTodoItem});
                _displayTodoItemContents(currentlySelectedTodoItem);
                addEventListenersToChecklistButtons();
                _handleDeleteButtonsForTodoItems(event);
                _removeCurrentlySelectedClassFromHolder(".currentlySelected.todoItemListItem");
                _addCurrentlySelectedClass(event.currentTarget);
            });
        }
    }
    
    const _handleDeleteButtonsForTodoItems = (event) => {
        if(isLast(_getTodoItemsOnDisplay()) == false) {

            if(event.target.classList == "deleteButton") {
                const index = getIndexOfElementFromEvent(event.currentTarget);
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
            DOM.removeTodoItemsContainer()
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
            DOM.displayProjects();
            _addEventListenersToProjects();
        });
    }


    const _addEventListenersToItemContent = () => {
        const itemContent = document.querySelector(".itemContentDisplay");
            itemContent.addEventListener("change", (event) => {
                _updateTodoItemValues();
                _updatePriorityIndicator();
                setProjectsContainerFromStorage();
                const titleTextarea = 0;
                if(getIndexOfElementFromEvent(event.target) == titleTextarea){
                    DOM.removeTodoItemsContainer();
                    _displayTodoItems();
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