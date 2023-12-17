import { createNewCollection, decksAvailable, setCurrentCollectionIndex } from "../collectionManager.js";
import { openPanel } from "./mainLayout.js";

export function setupMenu() {

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
