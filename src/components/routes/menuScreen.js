import { createNewCollection, decksAvailable, setCurrentCollectionIndex } from "../collectionManager.js";
import { openPanel, titleElement } from "./mainLayout.js";

const newBtn = document.getElementById("newBtn");
const loadBtn = document.getElementById("loadBtn");

console.log(newBtn, loadBtn);

export function setupMenu() {

  newBtn.addEventListener("click", () => createNewCollection());

  loadBtn.addEventListener("click", () => {
    while (loadingPanel.firstChild) {
      loadingPanel.removeChild(loadingPanel.lastChild);
    }

    decksAvailable.forEach((deck, index) => {
      var btnElement = document.createElement("button");
      btnElement.classList.add("deckBtn");
      btnElement.innerHTML = deck.collectionInfo.deckName;
      btnElement.addEventListener("click", () => {
        setCurrentCollectionIndex(index);
      });

      loadingPanel.appendChild(btnElement);
    });

    openPanel("loading");
    titleElement.innerHTML = "BIBLIOTHÈQUE DE COLLECTIONS";
  });

}
