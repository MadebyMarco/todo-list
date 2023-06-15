import { formatDistance, formatDistanceToNow, subDays } from "date-fns";
import { DOM } from "./dom";
import { addEventListeners } from "./ui";
import {
  getProjectsContainerFromStorage,
  setProjectsContainerFromStorage,
  syncProjectsContainers,
} from "./logic";
if (getProjectsContainerFromStorage() == null)
  setProjectsContainerFromStorage();
syncProjectsContainers();
DOM.load();
addEventListeners();
