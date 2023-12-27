import { createNewCollection} from "../collectionManager.js";
import { openPanel } from "./mainLayout.js";

export function setupMenu() {
  tutorialBtn.addEventListener("click", () => {
    window.open(`https://www.youtube.com/watch?v=vODPa1l_9q8&list=PLk03fyx-610aRbuL8wsF-e9e5T8pKYDCJ`);
  });

  newCollectionBtn.addEventListener("click", () => createNewCollection());

  loadCollectionBtn.addEventListener("click", () => openPanel("loading"));

  archivedCollectionsContainer.addEventListener("click", () => {
    if (archivedCollectionsContainer.classList.contains("active")) {
      archivedCollectionsContainer.style.maxHeight = "3.2rem";
    } else {
      archivedCollectionsContainer.style.maxHeight = "calc(2rem + " + archivedCollectionsContainer.scrollHeight + "px)";

    }

    archivedCollectionsContainer.classList.toggle("active");
  });
}
