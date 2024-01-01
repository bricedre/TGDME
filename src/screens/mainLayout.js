import { app } from "../app.js";
import { currentCollection, currentCollectionUID, getCollections, setCurrentCollection } from "../collection/collectionManager.js";
import { checkOtherInputs, updateCardCounter, populateComponents } from "./editionScreen.js";

const bottomBar = document.querySelector(".bottomBar");

export const rootElement = document.querySelector(":root");

homeBtn.addEventListener("click", () => {
  setCurrentCollection(-1);
  getCollections();
  openPanel("start");
});

document.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    generateCollectionBtn.click();
  } else if (event.key === "F1") {
    document.getElementById("tabConfigInput").checked = true;
  } else if (event.key === "F2") {
    document.getElementById("tabRessInput").checked = true;
  } else if (event.key === "F3") {
    document.getElementById("tabTemplateInput").checked = true;
  } else if (event.key === "F4") {
    document.getElementById("tabElementsInput").checked = true;
  } else if (event.key === "F5") {
    document.getElementById("tabPrintingInput").checked = true;
  }
});

const allInputs = document.querySelectorAll('input:not([type="radio"])');
const allSelects = document.querySelectorAll("select");

allInputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    populateComponents();
    checkOtherInputs(e.target.id, e.target.value);
  });
});

allSelects.forEach((select) => {
  select.addEventListener("change", (e) => {
    generateCollectionBtn.click();
    checkOtherInputs(e.target.id, e.target.value);
  });
});

export function openPanel(panelName) {
  switch (panelName) {
    case "start":
      startPanelDiv.style.display = "flex";
      loadingPanelDiv.style.display = "none";
      editionPanelDiv.style.display = "none";
      bottomBarDiv.style.display = "none";
      mainTitleDiv.innerHTML = "LA CABANE À PROTOS";

      break;

    case "loading":
      startPanelDiv.style.display = "none";
      loadingPanelDiv.style.display = "flex";
      editionPanelDiv.style.display = "none";
      bottomBarDiv.style.display = "none";
      mainTitleDiv.innerHTML = "BIBLIOTHÈQUE DE COLLECTIONS";
      break;

    case "edition":
      startPanelDiv.style.display = "none";
      loadingPanelDiv.style.display = "none";
      editionPanelDiv.style.display = "flex";
      bottomBarDiv.style.display = "flex";

      updateCardCounter();
      mainTitleDiv.innerHTML = currentCollection?.collectionInfo.collectionName;
      archiveCollectionBtn.innerHTML = currentCollection.collectionInfo.archived
        ? "DÉSARCHIVER LA COLLECTION<img src='./assets/archiveCollection.png'>"
        : "ARCHIVER LA COLLECTION<img src='./assets/archiveCollection.png'>";
      break;
  }
}
