import { createNewCollection, decksAvailable, setCurrentCollectionIndex } from "../collectionManager.js";
import { openPanel } from "./mainLayout.js";

export function setupMenu() {
  
  tutorialBtn.addEventListener("click", () => window.open("https://www.youtube.com/watch?v=vODPa1l_9q8&list=PLk03fyx-610aRbuL8wsF-e9e5T8pKYDCJ", '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes'));
  
  newCollectionBtn.addEventListener("click", () => createNewCollection());
  
  loadCollectionBtn.addEventListener("click", () => {
    while (loadingPanelDiv.firstChild) {
      loadingPanelDiv.removeChild(loadingPanelDiv.lastChild);
    }

    decksAvailable.forEach((deck, index) => {
      var btnElement = document.createElement("button");
      btnElement.classList.add("deckBtn");
      btnElement.innerHTML = deck.collectionInfo.deckName;
      btnElement.addEventListener("click", () => {
        setCurrentCollectionIndex(index);
      });

      loadingPanelDiv.appendChild(btnElement);
    });

    openPanel("loading");
    mainTitleDiv.innerHTML = "BIBLIOTHÈQUE DE COLLECTIONS";
  });

}
