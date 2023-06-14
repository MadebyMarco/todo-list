import { formatDistance, formatDistanceToNow, subDays } from "date-fns";
import { DOM } from "./dom";
import { addEventListenerToBody, addEventListeners } from "./ui";
import {
  getProjectsContainerFromStorage,
  setProjectsContainerFromStorage,
  syncProjectsContainers,
} from "./logic";
// const project = (title, items = []) => {
//     return {title, items}
// }

//sets local storage for the first time
// if (getProjectsContainerFromStorage() == null) {
//   console.log("Initializing for the first time");
//   setProjectsContainerFromStorage();
// }
syncProjectsContainers();
//updates local project container for storage

DOM.load();
addEventListeners();
addEventListenerToBody();

// todo: separate dom and logic even further
// todo: use date-fns for a date created :)
