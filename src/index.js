import { formatDistance, formatDistanceToNow, subDays } from "date-fns";
import { DOM } from "./dom";
import { addEventListeners } from "./ui";
// const project = (title, items = []) => {
//     return {title, items}
// }


DOM.load();
addEventListeners();

// todo: separate dom and logic even further
// todo: use date-fns for a date created :)