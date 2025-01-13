import { checkOtherInputs, updateElementsCounter } from "./editionScreen.js";
import { currentCollection, getCollections, setCurrentCollection } from "../core/collectionsManager.js";
import { populateComponents } from "../core/componentsManager.js";
import { getFontList } from "../core/assetsManager.js";
import { setupMenu } from "./menuScreen.js";
const $ = require("jquery");

export const rootElement = document.querySelector(":root");

const sceneUIElements = {
  titles : {
    "start" : "LA CABANE À PROTOS",
    "loading" : "BIBLIOTHÈQUE DE COLLECTIONS",
    "edition" : () => currentCollection?.collectionInfo.collectionName,
  },
  "icon" : {
    "start" : "./assets/home.png",
    "loading" : "./assets/newCollectionBtn.png",
    "edition" : "./assets/loadCollectionBtn.png",
  }
}

export let lastPanel = "start";
export let currentPanel = "start";

getFontList();
// getCollections();
// setupMenu();
openScene(currentPanel);

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

export function openScene(panelName) {

  $(".panel").css("display", "none");
  
  let $currentPanel;
  let homeIcon = $("#homeIcon");
  let bottomBarDiv = $("#bottomBarDiv");

  switch (panelName) {
    case "start":
      $currentPanel = $("#startPanelDiv");
      bottomBarDiv.css("display", "none");
      break;

    case "loading":
      $currentPanel = $("#loadingPanelDiv");
      bottomBarDiv.css("display", "none");
      break;

    case "edition":
      $currentPanel = $("#editionPanelDiv");
      bottomBarDiv.css("display", "flex");

      //Go back to Config tab all the time
      let firstRadio = document.querySelector(".tabs input");
      firstRadio.checked = true;

      updateElementsCounter();
      archiveCollectionBtn.innerHTML = currentCollection.collectionInfo.archived ? "DÉSARCHIVER<img src='./assets/archiveCollection.png'>" : "ARCHIVER<img src='./assets/archiveCollection.png'>";
      break;
  }
  
  $currentPanel.css("display", "flex");
  $currentPanel.text = sceneUIElements.titles[panelName];
  homeIcon.attr("src", sceneUIElements.icon[panelName]);

  lastPanel = currentPanel;
  currentPanel = panelName;
}
