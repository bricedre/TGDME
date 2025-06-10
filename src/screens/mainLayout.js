import { checkOtherInputs, updateElementsCounter } from "./editionScreen.js";
import { currentCollection, getCollections, setCurrentCollection } from "../core/collectionsManager.js";
import { populateComponents } from "../core/componentsManager.js";
import { getFontList } from "../core/assetsManager.js";
import { setupMenu } from "./menuScreen.js";
import { uiTexts } from "../core/translations.js";

const $ = require("jquery");

export let currentPanel = "home";
let langIndex = 0;
let langs = ["fr", "en", "es", "it", "pt-br", "el", "neo"];

const scenesSettings = {
  home: {
    title: "",
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
const allInputs = document.querySelectorAll('input:not([type="radio"])');
const allSelects = document.querySelectorAll("select");

// EVENT LISTENERS //
document.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    generateCollectionBtn.click();
  }
});

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

// FUNCTIONS
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

export function changeLangage() {
  langIndex = (langIndex + 1) % langs.length;
  setupLangage(langs[langIndex]);

}

export function setupLangage() {

  console.log("--- setupLangage")
  console.log(langs[langIndex]);

  Object.keys(uiTexts).forEach(key => {
    const elementsToSetup = $(`.${key}`);
    try {
      let textElements = uiTexts[key][langs[langIndex]].split("|");
      if (textElements.length > 0) {
        if (textElements[0] != "") elementsToSetup.text(textElements[0]);
      }
      if (textElements.length > 1) {
        if (textElements[1] != "") elementsToSetup.attr("title", textElements[1]);
      }
    }
    catch (e) {
      elementsToSetup.text(uiTexts["other_error"][langs[langIndex]])
    }
  })
}

getFontList();
openScene(currentPanel);