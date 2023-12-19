import { app } from "../../app.js";
import { currentCollection, currentCollectionIndex, setCurrentCollectionIndex } from "../collectionManager.js";
import { checkOtherInputs, updateCardCounter, updateComponents } from "./editionScreen.js";

const bottomBar = document.querySelector(".bottomBar");

export const rootElement = document.querySelector(":root");

homeBtn.addEventListener("click", () => {
  setCurrentCollectionIndex(-1);
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
    updateComponents();
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
  //MENU
  if (currentCollectionIndex == -1) {
    mainTitleDiv.innerHTML = "LA CABANE À PROTOS";
    tutorialBtn.style.display = "flex";
    newCollectionBtn.style.display = "flex";
    loadCollectionBtn.style.display = "flex";

    generateCollectionBtn.style.display = "none";
    renderCollectionBtn.style.display = "none";
    deleteCollectionBtn.style.display = "none";
    duplicateCollectionBtn.style.display = "none";
    archiveCollectionBtn.style.display = "none";
    addTextComponentBtn.style.display = "none";
    addShapeComponentBtn.style.display = "none";
    addImageComponentBtn.style.display = "none";
    renderCollectionBtn.style.display = "none";
    cardCounterDiv.style.display = "none";
    canvasDiv.style.display = "none";
    bottomBar.style.display = "none";
  }

  //EDITION
  else {
    mainTitleDiv.innerHTML = currentCollection?.collectionInfo.deckName;
    homeBtn.style.display = "flex";
    generateCollectionBtn.style.display = "flex";
    renderCollectionBtn.style.display = "flex";
    deleteCollectionBtn.style.display = "flex";
    duplicateCollectionBtn.style.display = "flex";
    archiveCollectionBtn.style.display = "flex";
    addTextComponentBtn.style.display = "flex";
    addShapeComponentBtn.style.display = "flex";
    addImageComponentBtn.style.display = "flex";
    cardCounterDiv.style.display = "flex";
    bottomBar.style.display = "flex";
    canvasDiv.style.display = "flex";

    tutorialBtn.style.display = "none";
    newCollectionBtn.style.display = "none";
    loadCollectionBtn.style.display = "none";

    updateCardCounter(app.currentIndex);
  }
}

export function openPanel(panelName) {
  startPanelDiv.style.display = "none";
  loadingPanelDiv.style.display = "none";
  editionPanelDiv.style.display = "none";

  switch (panelName) {
    case "start":
      startPanelDiv.style.display = "flex";
      break;

    case "loading":
      loadingPanelDiv.style.display = "grid";
      break;

    case "edition":
      editionPanelDiv.style.display = "flex";
      break;
  }

  setUI();
}
