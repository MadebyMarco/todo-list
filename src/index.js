// TOdo list items
// {title, descriptions, dueDate, priority, notes, checklist}

//todo lists will be separated through projects ex. {mondays todo list: do x y z, nephews birthday: do a b c} mondays todo list and nephews birthday are each a project.
// for conveniece, we will have a default project that users can easily put todo list items into
// users will be able to choose which project to add todo list items to

//todo list logic will be kept in one module while todo list DOM manipulation will be in another module
// todoItem for logic, todoItemDOM for dom manipulation 

const projects = [defaultProject];

const project = (title) => {
    const items = [];

    const addItem = (item) => {
        items.push(item);
    }

    return {title, addItem}
}

const defaultProject = new project("default");

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