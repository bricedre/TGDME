import { checkOtherInputs, updateElementsCounter } from "./editionScreen.js";
import { currentCollection, getCollections, setCurrentCollection } from "../core/collectionsManager.js";
import { populateComponents } from "../core/componentsManager.js";
import { getFontList } from "../core/assetsManager.js";
import { setupMenu } from "./menuScreen.js";
import { uiTexts } from "../core/translations.js";

const $ = require("jquery");

export let currentPanel = "home";
let currentColorScheme = 0;
let langIndex = 0;
let langs = ["fr", "en", "de"];

const scenesSettings = {
  home: {
    title: "",
    icon: "./assets/uiIcons/home.png",
    uiElement: "#startPanelDiv",
    hideFooter: true,
  },
  collectionEdition: {
    title: () => currentCollection?.collectionInfo.collectionName,
    icon: "./assets/uiIcons/home.png",
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
    if (input.type == "checkbox") {
      generateCollectionBtn.click();
    }
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

      //Hide archive buttons depending on state
      $("#unarchiveCollectionBtn").css("display", currentCollection.collectionInfo.archived?"flex":"none");
      $("#archiveCollectionBtn").css("display", currentCollection.collectionInfo.archived?"none":"flex");

      updateElementsCounter();

      break;
  }

  currentPanel = panelName;
}



export function changeColorScheme() {
  currentColorScheme = (currentColorScheme + 1) % 2;
  localStorage.setItem("colorScheme", currentColorScheme);
  setColorScheme();
}

export function setColorScheme() {
  
  if (localStorage.getItem("colorScheme")) currentColorScheme = parseInt(localStorage.getItem("colorScheme"));

  let r = document.querySelector(':root');
  switch (currentColorScheme) {
    case 0:
      r.style.setProperty('--bgColor', '#fbfdff');
      r.style.setProperty('--mainColor', '#77c9f2');
      r.style.setProperty('--mainBtnColor', '#d4eeff');
      r.style.setProperty('--mainColorDark', '#2d94c7');
      r.style.setProperty('--mainColorShadows', '#00496e30');
      r.style.setProperty('--mainColorLight', '#eaf8ff');
      r.style.setProperty('--mainColorText', '#07001c');
      r.style.setProperty('--panelBG', '#ededed');
      r.style.setProperty('--panelBGDarker', '#bdcdd5');
      r.style.setProperty('--categoryColor', '#68a');
      break;


    case 1:
      r.style.setProperty('--bgColor', '#343a40');
      r.style.setProperty('--mainColor', '#00324c');
      r.style.setProperty('--mainBtnColor', '#002136');
      r.style.setProperty('--mainColorDark', '#00abff');
      r.style.setProperty('--mainColorShadows', '#00000094');
      r.style.setProperty('--mainColorLight', '#eaf8ff');
      r.style.setProperty('--mainColorText', '#d7e7ff');
      r.style.setProperty('--panelBG', '#282828');
      r.style.setProperty('--panelBGDarker', '#191a1a');
      r.style.setProperty('--categoryColor', '#68a');
      break;
  }
}

export function changeLangage() {
  langIndex = (langIndex + 1) % langs.length;
  localStorage.setItem("lang", langIndex);
  setupLangage();

}

export function setupLangage() {

  if (localStorage.getItem("lang")) langIndex = parseInt(localStorage.getItem("lang"));

  $("#langBtnIcon").attr("src", `assets/flags/${langs[langIndex]}.png`);

  Object.keys(uiTexts).forEach(key => {
    const elementsToSetup = $(`.${key}`);
    try {
      let textElements = uiTexts[key][langs[langIndex]].split("|");
      if (textElements.length > 0) {
        if (textElements[0] != "") {
          elementsToSetup.text(textElements[0]);
        }
      }
      if (textElements.length > 1) {
        if (textElements[1] != "") elementsToSetup.attr("title", textElements[1]);
      }


    }
    catch (e) {
      elementsToSetup.text()
    }
  })
}

getFontList();
setColorScheme();
setupLangage();
openScene(currentPanel);

setTimeout(() => {
  $(".blindfold").css("opacity", "0")
  setTimeout(() => {
    $(".blindfold").remove();
  }, 1000);
}, 1000);