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

    const addItem = (item, project) => {
        project.items.push(item);
    }

    return {
        create,
        addToProjectsContainer,
        removeFromProjectsContainer,
        addItem,
    }
})();

const moduletest = project.create("moduleTester");

// separated adding items to project to follow single responsibility principle


const defaultProject = project.create("default");
const projectsContainer = [];

project.addToProjectsContainer(moduletest);

const todoItem = (title, description, dueDate, priority, notes, ...checklist) => {


    return  {
        title,
        description,
        dueDate,
        priority,
        notes,
        checklist,
    }
}

// Making the checklist conversion into a separate function instead of a todoItem property/interal job
// by making items on my check list objects with two keys, name & checked, I can store store and render the info easily.
// I need to make every input into checklist an object. I can forEach over and set name to whatever is in checklist.
function convertChecklistToObjects(todoItem) {
    const objectChecklist = [];
    todoItem.checklist.forEach(item => {
        const itemObject = {checklistItemName: `${item}`, checked: false};
        objectChecklist.push(itemObject);
    });

    todoItem.checklist = objectChecklist;
}


const testItem = todoItem("cleaning","bathrooms", "today", "low", "make sure to get the white wood thing", "oo figure out how to make checklist, maybe array", "does it work", "but now how do i know someone has checked off a todolist item");

project.addItem(testItem, defaultProject);
convertChecklistToObjects(testItem);
project.addToProjectsContainer(defaultProject);

console.log(projectsContainer[0]);


function removeTodoItemFromProject(itemForRemoval, project) {
    const index = project.items.findIndex(item => item.title == itemForRemoval.title);
    project.items.splice(index, 1);
}
project.removeFromProjectsContainer(moduletest)

console.log(projectsContainer);

console.log(defaultProject)

console.log(moduletest);