import { app } from "../../app.js";
import { currentCollection, currentCollectionIndex, saveCollection, setCurrentCollectionIndex } from "../collectionManager.js";
import { checkOtherInputs, updateCardCounter, updateTemplateItems } from "./editionScreen.js";

const bottomBar = document.querySelector(".bottomBar");
const cardCounter = document.getElementById("cardCounter");


export const rootElement = document.querySelector(":root");
export const titleElement = document.getElementById("title");

const startPanel = document.getElementById("startPanel");
const loadingPanel = document.getElementById("loadingPanel");
const editionPanel = document.getElementById("editionPanel");
const canvasPanel = document.getElementById("canvasPanel");

homeBtn.addEventListener("click", () => {
  setCurrentCollectionIndex(-1);
  openPanel("start");
});

document.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    saveCollection(false);
  } else if (event.key === "F1") {
    document.getElementById("tab-config").checked = true;
  } else if (event.key === "F2") {
    document.getElementById("tab-ress").checked = true;
  } else if (event.key === "F3") {
    document.getElementById("tab-template").checked = true;
  } else if (event.key === "F4") {
    document.getElementById("tab-elements").checked = true;
  } else if (event.key === "F5") {
    document.getElementById("tab-printing").checked = true;
  }
});

const allInputs = document.querySelectorAll('input:not([type="radio"])');
const allSelects = document.querySelectorAll("select");

allInputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    // saveCollection(false);
    // populateEditionFields();
    updateTemplateItems();
    checkOtherInputs(e.target.id, e.target.value);
  });
});

allSelects.forEach((select) => {
  select.addEventListener("change", (e) => {
    // saveCollection(false);
    // populateEditionFields();
    saveCollection(false);
    // updateTemplateItems();
    checkOtherInputs(e.target.id, e.target.value);
  });
});

export function setUI() {
  //MENU
  if (currentCollectionIndex == -1) {
    generateBtn.style.display = "none";
    newBtn.style.display = "flex";
    loadBtn.style.display = "flex";
    renderBtn.style.display = "none";
    deleteBtn.style.display = "none";
    duplicateBtn.style.display = "none";

    textTemplateBtn.style.display = "none";
    stripTemplateBtn.style.display = "none";
    imageTemplateBtn.style.display = "none";

    renderBtn.style.display = "none";
    cardCounter.style.display = "none";
    canvasPanel.style.display = "none";
    titleElement.innerHTML = "L'USINE À PROTOS";
    bottomBar.style.display = "none";
  }

  //EDITION
  else {
    homeBtn.style.display = "flex";
    generateBtn.style.display = "flex";
    newBtn.style.display = "none";
    loadBtn.style.display = "none";
    renderBtn.style.display = "flex";
    deleteBtn.style.display = "flex";
    duplicateBtn.style.display = "flex";
    textTemplateBtn.style.display = "flex";
    stripTemplateBtn.style.display = "flex";
    imageTemplateBtn.style.display = "flex";
    cardCounter.style.display = "flex";
    bottomBar.style.display = "flex";
    canvasPanel.style.display = "flex";
    titleElement.innerHTML = currentCollection?.collectionInfo.deckName;
    updateCardCounter(app.currentIndex);
  }
}

export function openPanel(panelName) {
  startPanel.style.display = "none";
  loadingPanel.style.display = "none";
  editionPanel.style.display = "none";

  switch (panelName) {
    case "start":
      startPanel.style.display = "flex";
      break;

    case "loading":
      loadingPanel.style.display = "grid";
      break;

    case "edition":
      editionPanel.style.display = "flex";
      break;
  }

  setUI();
}
