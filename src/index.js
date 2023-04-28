// TOdo list items
// {title, descriptions, dueDate, priority, notes, checklist}

//todo lists will be separated through projects ex. {mondays todo list: do x y z, nephews birthday: do a b c} mondays todo list and nephews birthday are each a project.
// for conveniece, we will have a default project that users can easily put todo list items into
// users will be able to choose which project to add todo list items to

//todo list logic will be kept in one module while todo list DOM manipulation will be in another module
// todoItem for logic, todoItemDOM for dom manipulation 


const project = (title, items = []) => {
    return {title, items}
}
// separated adding items to project to follow single responsibility principle
const addItemToProject = (item, project) => {
    project.items.push(item);

}

const defaultProject = project("default");
const projects = [defaultProject];

const todoItem = (title, description, dueDate, priority, notes, checklist) => {
    return  {
        title,
        description,
        dueDate,
        priority,
        notes,
        checklist
    }
}

const testItem = todoItem("cleaning","bathrooms", "today", "low", "make sure to get the white wood thing", ["oo figure out how to make checklist, maybe array", "does it work"]);
console.log(testItem);

addItemToProject(testItem, defaultProject);
console.log(defaultProject);