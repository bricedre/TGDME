import { app } from "../../app.js";
import { currentCollection, currentCollectionUID, getCollections, setCurrentCollection } from "../collectionManager.js";
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

export function setUI() {

  var elementsToDisplay;
  var elementsToHide;

  //MENU
  if (currentCollectionUID == -1) {
    elementsToDisplay = [tutorialBtn, newCollectionBtn, loadCollectionBtn];
    elementsToHide = [generateCollectionBtn, renderCollectionBtn, deleteCollectionBtn,
      duplicateCollectionBtn, archiveCollectionBtn, addTextComponentBtn, addShapeComponentBtn,
      addImageComponentBtn, addNewElementBtn, checkAllBtn, wizardFillBtn, renderCollectionBtn,
      cardCounterDiv, canvasDiv, bottomBar];
  }

  //EDITION
  else {
    elementsToDisplay = [generateCollectionBtn, renderCollectionBtn, deleteCollectionBtn,
      duplicateCollectionBtn, archiveCollectionBtn, addTextComponentBtn, addShapeComponentBtn,
      addImageComponentBtn, addNewElementBtn, checkAllBtn, wizardFillBtn, renderCollectionBtn,
      cardCounterDiv, canvasDiv, bottomBar];
    elementsToHide = [tutorialBtn, newCollectionBtn, loadCollectionBtn];
    updateCardCounter();
  }

  elementsToDisplay.forEach(el => el.style.display = "flex");
  elementsToHide.forEach(el => el.style.display = "none");
}

export function openPanel(panelName) {
  switch (panelName) {
    case "start":
      loadingPanelDiv.style.display = "none";
      editionPanelDiv.style.display = "none";
      startPanelDiv.style.display = "flex";

      setUI();
      mainTitleDiv.innerHTML = "LA CABANE À PROTOS";

      break;

    case "loading":
      startPanelDiv.style.display = "none";
      editionPanelDiv.style.display = "none";
      loadingPanelDiv.style.display = "flex";

      setUI();
      mainTitleDiv.innerHTML = "BIBLIOTHÈQUE DE COLLECTIONS";

      break;

    case "edition":
      editionPanelDiv.style.display = "flex";
      loadingPanelDiv.style.display = "none";
      startPanelDiv.style.display = "none";

      setUI();
      mainTitleDiv.innerHTML = currentCollection?.collectionInfo.collectionName;
      archiveCollectionBtn.innerHTML = currentCollection.collectionInfo.archived
        ? "DÉSARCHIVER LA COLLECTION<img src='./assets/archiveCollection.png'>"
        : "ARCHIVER LA COLLECTION<img src='./assets/archiveCollection.png'>";
      break;
  }
}
