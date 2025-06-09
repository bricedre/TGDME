import { checkOtherInputs, updateElementsCounter } from "./editionScreen.js";
import { currentCollection, getCollections, setCurrentCollection } from "../core/collectionsManager.js";
import { populateComponents } from "../core/componentsManager.js";
import { getFontList } from "../core/assetsManager.js";
import { setupMenu } from "./menuScreen.js";
const $ = require("jquery");

const scenesSettings = {
  home: {
    title: "LA CABANE À PROTOS",
    icon: "./assets/home.png",
    uiElement: "#startPanelDiv",
    hideFooter: true,
  },
  collectionEdition: {
    title: () => currentCollection?.collectionInfo.collectionName,
    icon: "./assets/home.png",
    uiElement: "#collectionEditionPanel",
    hideFooter: false,
  }
};

export let currentPanel = "home";

getFontList();
openScene(currentPanel);

document.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    generateCollectionBtn.click();
  }
});

const allInputs = document.querySelectorAll('input:not([type="radio"])');
allInputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    populateComponents();
    checkOtherInputs(e.target.id, e.target.value);
  });
});

const allSelects = document.querySelectorAll("select");
allSelects.forEach((select) => {
  select.addEventListener("change", (e) => {
    generateCollectionBtn.click();
    checkOtherInputs(e.target.id, e.target.value);
  });
});

export function openScene(panelName) {
  $(".panel").css("display", "none");

  let currentPanelDiv = $(scenesSettings[panelName].uiElement);
  currentPanelDiv.css("display", "flex");

  let homeIcon = $("#homeIcon");
  homeIcon.attr("src", scenesSettings[panelName].icon);

  let mainTitleDiv = $("#mainTitleDiv");
  mainTitleDiv.text(scenesSettings[panelName].title);

  let bottomBarDiv = $("#bottomBarDiv");
  bottomBarDiv.css("display", scenesSettings[panelName].hideFooter ? "none" : "flex");

  switch (panelName) {
    case "collectionEdition":
      //Go back to Config tab all the time
      let firstRadio = document.querySelector(".tabs input");
      firstRadio.checked = true;

      updateElementsCounter();
      archiveCollectionBtn.innerHTML = currentCollection.collectionInfo.archived ? "DÉSARCHIVER<img src='./assets/archiveCollection.png'>" : "ARCHIVER<img src='./assets/archiveCollection.png'>";
      break;
  }

  currentPanel = panelName;
}
