import { formatDistance, formatDistanceToNow, subDays } from "date-fns";
import { DOM } from "./dom";
import { addEventListenerToBody } from "./ui";
import {
  getProjectsContainerFromStorage,
  setProjectsContainerFromStorage,
  syncProjectsContainers,
} from "./logic";

import "./style.css";

if (getProjectsContainerFromStorage() == null)
  setProjectsContainerFromStorage();
syncProjectsContainers();
DOM.load();
addEventListenerToBody();
