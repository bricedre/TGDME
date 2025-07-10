import { checkOtherInputs, updateElementsCounter } from "./editionScreen.js";
import { currCollInfo, currentCollection } from "../core/collectionsManager.js";
import { populateComponents } from "../core/componentsManager.js";
import { getFontList } from "../core/assetsManager.js";
import { uiTexts } from "../translations.js";
import { setGlobalVariables } from "../core/render.js";
import { app } from "../app.js";
import { currentProject } from "../core/projectsManager.js";

const $ = require("jquery");
const lodash = require("lodash");
const fs = require("fs").promises;
const fs2 = require("fs");

export let currentPanel = "";
let currentColorScheme = 0;
let langIndex = 0;
let langs = ["fr", "en", "de"];

const allInputs = document.querySelectorAll('input:not([type="radio"])');
const allSelects = document.querySelectorAll("select");

// EVENT LISTENERS //
document.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    generateCollectionBtn.click();
  }
});

const debouncedRender = lodash.debounce(() => generateCollectionBtn.click(), 300);
allInputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    populateComponents();
    checkOtherInputs(e.target.id, e.target.value);
    debouncedRender(); // Wait for user to stop typing
  });
});

allSelects.forEach((select) => {
  select.addEventListener("change", (e) => {
    generateCollectionBtn.click();
    checkOtherInputs(e.target.id, e.target.value);
  });
});

// FUNCTIONS
export async function getFolderContents(path, fileToExplore) {
  console.log("> getFolderContents", fileToExplore);

  let _content;

  try {
    const folderNames = fs2
      .readdirSync(path, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
      .sort((a, b) => {
        return a - b;
      });

    _content = [];

    // Use a for loop to process each folder sequentially
    for (const folder of folderNames) {
      const data = await fs.readFile(`${path}/${folder}/${fileToExplore}`);
      _content.push(JSON.parse(data));
    }
  } catch (e) {
    console.log(e);
    _content = [];
  }

  return _content;
}

export function openScene(panelName) {
  if (panelName !== currentPanel) {
    let lastPanel;
    let nextPanel;

    //FADE OUT
    if (currentPanel !== "") {
      switch (currentPanel) {
        case "home":
          lastPanel = $("#projectSelectionPanel");
          break;
        case "projectEdition":
          lastPanel = $("#projectEditionPanel");
          break;
        case "collectionEdition":
          lastPanel = $("#collectionEditionPanel");
          break;
      }

      lastPanel.css("opacity", 0);
      setTimeout(() => {
        lastPanel.css("display", "none");
      }, 500);
    }

    //HEADER & FOOTER
    $("#mainTitleDiv").removeClass("other_mainTitle");
    $("#mainTitleDiv").empty();
    $("#bottomBarDiv").css("display", "none");

    switch (panelName) {
      case "home":
        nextPanel = $("#projectSelectionPanel");
        $("#mainTitleDiv").addClass("other_mainTitle");
        break;

      case "projectEdition":
        var projectBc = $("<span class='breadcrumbs'></span>").text(currentProject.projectName);
        $("#mainTitleDiv").append($("<span class='separatorBc'>></span>"), projectBc);
        nextPanel = $("#projectEditionPanel");
        break;

      case "collectionEdition":
        var projectBc = $("<span class='breadcrumbs'></span>")
          .text(currentProject.projectName)
          .on("click", () => openScene("projectEdition"))
          .css("cursor", "pointer");
        var collectionBc = $("<span class='breadcrumbs'></span>").text(currCollInfo.collectionName);
        $("#mainTitleDiv").append($("<span class='separatorBc'>></span>"), projectBc, $("<span class='separatorBc'>></span>"), collectionBc);

        $("#bottomBarDiv").css("display", "flex");

        //Go back to Config tab all the time
        let firstRadio = document.querySelector(".tabs input");
        firstRadio.checked = true;

        //Hide archive buttons depending on state
        $("#unarchiveCollectionBtn").css("display", currCollInfo.archived ? "flex" : "none");
        $("#archiveCollectionBtn").css("display", currCollInfo.archived ? "none" : "flex");

        updateElementsCounter();

        nextPanel = $("#collectionEditionPanel");

        break;
    }

    setTimeout(() => {
      nextPanel.css("display", "flex");
      setTimeout(() => {
        nextPanel.css("opacity", 1);
      }, 100);
    }, 500);

    currentPanel = panelName;

    setupLangage();
  }
}

export function changeColorScheme() {
  currentColorScheme = (currentColorScheme + 1) % 2;
  localStorage.setItem("colorScheme", currentColorScheme);
  setColorScheme();
}

export function setColorScheme() {
  if (localStorage.getItem("colorScheme")) currentColorScheme = parseInt(localStorage.getItem("colorScheme"));

  let r = document.querySelector(":root");
  switch (currentColorScheme) {
    case 0:
      r.style.setProperty("--bgColor", "#fbfdff");
      r.style.setProperty("--mainColor", "#77c9f2");
      r.style.setProperty("--mainBtnColor", "#d4eeff");
      r.style.setProperty("--mainColorDark", "#2d94c7");
      r.style.setProperty("--mainColorShadows", "#00496e30");
      r.style.setProperty("--mainColorLight", "#eaf8ff");
      r.style.setProperty("--mainColorText", "#07001c");
      r.style.setProperty("--panelBG", "#ededed");
      r.style.setProperty("--panelBGDarker", "#bdcdd5");
      r.style.setProperty("--categoryColor", "#68a");
      break;

    case 1:
      r.style.setProperty("--bgColor", "#343a40");
      r.style.setProperty("--mainColor", "#00324c");
      r.style.setProperty("--mainBtnColor", "#002136");
      r.style.setProperty("--mainColorDark", "#00abff");
      r.style.setProperty("--mainColorShadows", "#00000094");
      r.style.setProperty("--mainColorLight", "#eaf8ff");
      r.style.setProperty("--mainColorText", "#d7e7ff");
      r.style.setProperty("--panelBG", "#282828");
      r.style.setProperty("--panelBGDarker", "#191a1a");
      r.style.setProperty("--categoryColor", "#68a");
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

  Object.keys(uiTexts).forEach((key) => {
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
    } catch (e) {
      console.log(e);
      elementsToSetup.text();
    }
  });
}

getFontList();
setColorScheme();
setupLangage();
openScene("home");

setTimeout(() => {
  $(".blindfold").css("opacity", "0");
  setTimeout(() => {
    $(".blindfold").remove();
  }, 500);
}, 500);
