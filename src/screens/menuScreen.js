import { createNewCollection} from "../collection/collectionManager.js";
import { openPanel } from "./mainLayout.js";

export function setupMenu() {
  tutorialBtn.addEventListener("click", () => {
    window.open(`https://www.youtube.com/watch?v=vODPa1l_9q8&list=PLk03fyx-610aRbuL8wsF-e9e5T8pKYDCJ`);
  });

  newCollectionBtn.addEventListener("click", () => createNewCollection());

  loadCollectionBtn.addEventListener("click", () => openPanel("loading"));
  
}
