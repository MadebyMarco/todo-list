import { formatDistance, formatDistanceToNow, subDays } from "date-fns";
import { DOM } from "./dom";
import { addEventListeners } from "./ui";
import { getProjectsContainerFromStorage, setProjectsContainerFromStorage, syncProjectsContainers } from "./logic";
// const project = (title, items = []) => {
//     return {title, items}
// }

//sets local storage for the first time
if(getProjectsContainerFromStorage() == null) {
    setProjectsContainerFromStorage();
}
//updates local project container for storage
syncProjectsContainers();

DOM.load();
addEventListeners();

// todo: separate dom and logic even further
// todo: use date-fns for a date created :)