import {
  addNewImage,
  addNewStrip,
  addNewText,
  createNewDeck,
  currentCollection,
  currentCollectionIndex,
  decksAvailable,
  saveCollection,
  setCurrentCollectionIndex,
  setupCollectionDimensions,
} from "./globalStuff.js";
import { renderCardUsingTemplate, triggerGeneration } from "./render.js";
import { app } from "../app.js";
import {
  IMAGE_parameters,
  STRIP_parameters,
  TEXT_parameters,
} from "./elementsParameters.js";

const rootElement = document.querySelector(":root");
const titleElement = document.getElementById("title");

const startPanel = document.getElementById("startPanel");
const loadingPanel = document.getElementById("loadingPanel");
const editionPanel = document.getElementById("editionPanel");
const canvasPanel = document.getElementById("canvasPanel");

const newBtn = document.getElementById("newBtn");
const loadBtn = document.getElementById("loadBtn");

const imageTemplateBtn = document.getElementById("imageTemplateBtn");
const stripTemplateBtn = document.getElementById("stripTemplateBtn");
const textTemplateBtn = document.getElementById("textTemplateBtn");
const duplicateBtn = document.getElementById("duplicateBtn");
const deleteBtn = document.getElementById("deleteBtn");
const renderBtn = document.getElementById("renderBtn");

const templateItems = document.getElementById("templateItems");
const elementItems = document.getElementById("elementItems");

const bottomBar = document.querySelector(".bottomBar");
const cardCounter = document.getElementById("cardCounter");
const cardCounterLabel = document.getElementById("cardCounterLabel");
const bigNextCardBtn = document.getElementById("bigNextCardBtn");
const nextCardBtn = document.getElementById("nextCardBtn");
const prevCardBtn = document.getElementById("prevCardBtn");
const bigPrevCardBtn = document.getElementById("bigPrevCardBtn");

//COLLECTION PARAMETERS
export const collectionName = document.getElementById("collectionName");
export const elementFormat = document.getElementById("elementFormat");
export const elementWidth = document.getElementById("elementWidth");
export const elementHeight = document.getElementById("elementHeight");
export const visualGuide = document.getElementById("visualGuide");
export const pageFormat = document.getElementById("pageFormat");
export const pageOrientation = document.getElementById("pageOrientation");
export const pageWidth = document.getElementById("pageWidth");
export const pageHeight = document.getElementById("pageHeight");
export const pageResolution = document.getElementById("pageResolution");
export const cuttingHelp = document.getElementById("cuttingHelp");

const allInputs = document.querySelectorAll('input:not([type="radio"])');
const allSelects = document.querySelectorAll("select");

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

generateBtn.addEventListener("click", () => {
  saveCollection(false);
});

newBtn.addEventListener("click", () => createNewDeck());

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

renderBtn.addEventListener("click", () => {
  triggerGeneration(app);
});

bigPrevCardBtn.addEventListener("click", () => {
  goToOtherCard(-10);
});

prevCardBtn.addEventListener("click", () => {
  goToOtherCard(-1);
});

nextCardBtn.addEventListener("click", () => {
  goToOtherCard(1);
});

bigNextCardBtn.addEventListener("click", () => {
  goToOtherCard(10);
});

imageTemplateBtn.addEventListener("click", () => addNewImage());
textTemplateBtn.addEventListener("click", () => addNewText());
stripTemplateBtn.addEventListener("click", () => addNewStrip());

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

//
// FUNCTIONS
//

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

export function setupTemplateItems() {
  while (templateItems.firstChild) {
    templateItems.removeChild(templateItems.lastChild);
  }

  currentCollection.template.forEach((item, itemIndex) => {
    createNewComponent(item, itemIndex);
  });
}

export function createNewComponent(item, itemIndex) {
  var itemAccordion = document.createElement("button");
  itemAccordion.id = itemIndex;
  itemAccordion.classList.add("accordion");

  var icon;
  var parametersToLoad;
  switch (item.component) {
    case "IMAGE":
      icon = "assets/img.png";
      parametersToLoad = IMAGE_parameters;
      break;
    case "TEXT":
      icon = "assets/text.png";
      parametersToLoad = TEXT_parameters;
      break;
    case "STRIP":
      icon = "assets/plus.png";
      parametersToLoad = STRIP_parameters;
      break;
  }

  itemAccordion.innerHTML =
    "<img src='" + icon + "'><span>" + item.componentName.value + "</span>";

  if (itemIndex > 0) {
    var upElementBtn = document.createElement("img");
    upElementBtn.classList.add("upElementBtn");
    upElementBtn.src = "./assets/upElement.png";
    upElementBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      moveElement(itemIndex, -1);
      saveCollection(false);
    });
    itemAccordion.appendChild(upElementBtn);
  }

  if (itemIndex < currentCollection.template.length - 1) {
    var downElementBtn = document.createElement("img");
    downElementBtn.classList.add("downElementBtn");
    downElementBtn.src = "./assets/downElement.png";
    downElementBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      moveElement(itemIndex, 1);
      saveCollection(false);
    });
    itemAccordion.appendChild(downElementBtn);
  }

  var visibilityBtn = document.createElement("img");
  visibilityBtn.classList.add("visibilityBtn");
  if (item.isVisible) visibilityBtn.src = "./assets/eye.png";
  else visibilityBtn.src = "./assets/eyeClosed.png";
  visibilityBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    item.isVisible = !item.isVisible;
    saveCollection(false);
    updateTemplateItems();
  });
  itemAccordion.appendChild(visibilityBtn);

  var deleteBtn = document.createElement("img");
  deleteBtn.classList.add("deleteBtn");
  deleteBtn.src = "./assets/delete.png";
  deleteBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    currentCollection.template.splice(e.target.parentNode.id, 1);
    saveCollection(false);
    setupTemplateItems();
  });
  itemAccordion.appendChild(deleteBtn);

  itemAccordion.addEventListener("click", () => {
    var panel = itemAccordion.nextElementSibling;
    if (itemAccordion.classList.contains("active")) {
      panel.style.maxHeight = "0";
      panel.style.marginBottom = "0rem";
      panel.style.padding = "0rem";
    } else {
      panel.style.maxHeight = "calc(2rem + " + panel.scrollHeight + "px)";
      panel.style.marginBottom = "1rem";
      panel.style.padding = "1rem";
    }

    itemAccordion.classList.toggle("active");
  });

  var itemPanel = document.createElement("div");
  itemPanel.classList.add("itemPanel");

  parametersToLoad.forEach((param, paramIndex) => {
    var parameterSlot = document.createElement("div");
    parameterSlot.classList.add("parameterSlot");

    var parameterName = document.createElement("p");
    parameterName.classList.add("parameterName");
    parameterName.innerHTML = param.name;

    var parameterInputLine = document.createElement("div");
    parameterInputLine.classList.add("parameterInputLine");

    var parameterInput = document.createElement("input");
    var inputID = itemIndex + "-" + param.refValue;
    parameterInput.id = inputID;
    parameterInput.addEventListener("input", (e) => {
      try {
        currentCollection.template[itemIndex][param.refValue]["value"] =
          e.target.value;
      } catch {
        currentCollection.template[itemIndex][param.refValue] = {
          value: e.target.value,
          type: "0",
        };
      }
      // saveCollection(false);
    });

    var modeInput = document.createElement("img");
    modeInput.classList.add("modeInput");

    if (param.type !== "spacer") {
      var currentMode;
      try {
        currentMode =
          currentCollection.template[itemIndex][param.refValue]["type"];
      } catch (e) {
        currentMode = "0";
      }

      modeInput.src =
        currentMode == "0"
          ? "./assets/arbitrary.png"
          : "./assets/elementBased.png";
      modeInput.title = currentMode == "0" ? "Fixe" : "Basé sur l'élement";
      modeInput.id = inputID;
      modeInput.addEventListener("click", () => {
        currentCollection.template[itemIndex][param.refValue]["type"] =
          currentCollection.template[itemIndex][param.refValue]["type"] == "0"
            ? "1"
            : "0";
        updateTemplateItems();
      });
    }

    if (param.type !== "spacer") {
      if (param.type === "checkbox") {
        parameterInput.type = param.type;
        parameterInput.checked = item[param.refValue]["value"];
        parameterInput.addEventListener("input", (e) => {
          currentCollection.template[itemIndex][param.refValue]["value"] =
            e.target.checked;
          // saveCollection(false);
        });
        parameterName = document.createElement("label");
        parameterName.setAttribute("for", inputID);
        parameterName.classList.add("parameterName");
        parameterName.innerHTML = param.name;
        parameterInputLine.appendChild(parameterInput);
        parameterInputLine.appendChild(parameterName);
        if (!param.forced) parameterInputLine.appendChild(modeInput);
        parameterSlot.appendChild(parameterInputLine);
      } else if (param.type === "select") {
        parameterInput = document.createElement("select");
        parameterInput.classList.add("parameterInput");
        parameterInput.id = inputID;
        parameterInput.addEventListener("input", (e) => {
          currentCollection.template[itemIndex][param.refValue]["value"] =
            e.target.value;
          updateTemplateItems();
          // saveCollection(false);
        });
        param.options.forEach((opt) => {
          var option = document.createElement("option");
          option.value = opt.value;
          option.innerHTML = opt.label;
          parameterInput.appendChild(option);
        });
        parameterInput.value = item[param.refValue]["value"];

        parameterSlot.appendChild(parameterName);
        parameterInputLine.appendChild(parameterInput);
        if (!param.forced) parameterInputLine.appendChild(modeInput);
        parameterSlot.appendChild(parameterInputLine);
      } else {
        parameterInput.classList.add("parameterInput");
        if (param.type === "color") parameterInput.style.padding = "0.2rem";
        parameterInput.type = param.type;
        try {
          parameterInput.value = item[param.refValue]["value"];
        } catch (e) {
          parameterInput.value = "";
        }
        parameterSlot.appendChild(parameterName);
        parameterInputLine.appendChild(parameterInput);
        if (!param.forced) parameterInputLine.appendChild(modeInput);
        parameterSlot.appendChild(parameterInputLine);
      }
    } else {
      parameterName.classList.add("spacer");
      if (paramIndex == 0) parameterName.classList.add("firstSpacer");
      parameterSlot.appendChild(parameterName);
    }

    itemPanel.appendChild(parameterSlot);
  });

  templateItems.appendChild(itemAccordion);
  templateItems.appendChild(itemPanel);
}

export function updateTemplateItems() {
  var allAccordions = templateItems.querySelectorAll(".accordion");
  currentCollection.template.forEach((item, index) => {
    var icon;
    var parametersToLoad;
    switch (item.component) {
      case "IMAGE":
        icon = "assets/img.png";
        parametersToLoad = IMAGE_parameters;
        break;
      case "TEXT":
        icon = "assets/text.png";
        parametersToLoad = TEXT_parameters;
        break;
      case "STRIP":
        icon = "assets/plus.png";
        parametersToLoad = STRIP_parameters;
        break;
    }

    allAccordions[index].querySelector("img").src = icon;

    allAccordions[index].querySelector("span").innerHTML =
      item.componentName.value;
    if (item.isVisible)
      allAccordions[index].querySelector(".visibilityBtn").src =
        "./assets/eye.png";
    else
      allAccordions[index].querySelector(".visibilityBtn").src =
        "./assets/eyeClosed.png";
  });

  var allInputs = templateItems.querySelectorAll("input, select");
  allInputs.forEach((input) => {
    var inputID = input.id;
    var inputIndex = inputID.split("-")[0];
    var inputRefValue = inputID.split("-")[1];
    try {
      input.value =
        currentCollection.template[inputIndex][inputRefValue]["value"];
    } catch (e) {
      input.value = 0;
    }
  });

  var allModeBtns = templateItems.querySelectorAll(".modeInput");
  allModeBtns.forEach((input) => {
    var inputID = input.id;
    var inputIndex = inputID.split("-")[0];
    var inputRefValue = inputID.split("-")[1];
    var currentMode;
    try {
      currentMode =
        currentCollection.template[inputIndex][inputRefValue]["type"];
    } catch (e) {
      currentMode = "0";
    }
    input.src =
      currentMode == "0"
        ? "./assets/arbitrary.png"
        : "./assets/elementBased.png";
    input.title = currentMode == "0" ? "Fixe" : "Basé sur l'élement";

    // document.getElementById(inputID).disabled = currentMode === "1";
  });
}

export function updateCardCounter(currentIndex) {
  //INDEX
  if (currentCollection.elements.length > 0) {
    cardCounterLabel.innerHTML =
      "Élément #" +
      (currentIndex + 1) +
      " sur " +
      currentCollection.elements.length +
      " - " +
      (currentCollection.elements[currentIndex].quantity
        ? currentCollection.elements[currentIndex].quantity + " copies"
        : "1 copie");
  } else {
    cardCounterLabel.innerHTML = "PAS DE CARTE À AFFICHER";
  }

  checkCardButtons();
}

export function checkCardButtons() {
  if (app.currentIndex != 0) prevCardBtn.disabled = false;
  else prevCardBtn.disabled = true;

  if (
    currentCollection.elements.length > 0 &&
    app.currentIndex != currentCollection.elements.length - 1
  )
    nextCardBtn.disabled = false;
  else nextCardBtn.disabled = true;

  if (app.currentIndex < 10) bigPrevCardBtn.disabled = true;
  else bigPrevCardBtn.disabled = false;

  if (app.currentIndex > currentCollection.elements.length - 10)
    bigNextCardBtn.disabled = true;
  else bigNextCardBtn.disabled = false;
}

export function goToOtherCard(delta) {
  app.currentIndex = Math.min(
    Math.max(parseInt(app.currentIndex + delta), 0),
    currentCollection.elements.length - 1
  );
  renderCardUsingTemplate(
    app,
    app.currentIndex,
    currentCollection.collectionInfo.visualGuide
  );
  updateCardCounter(app.currentIndex);
  rootElement.style.setProperty("--cardAngle", 3 - app.random() * 6 + "deg");
  checkCardButtons();
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

export function populateEditionFields() {
  collectionName.value = currentCollection.collectionInfo.deckName;
  elementFormat.value = currentCollection.collectionInfo.elementFormat;
  elementWidth.value = currentCollection.collectionInfo.W;
  elementHeight.value = currentCollection.collectionInfo.H;
  visualGuide.value = currentCollection.collectionInfo.visualGuide;

  pageFormat.value = currentCollection.collectionInfo.pageFormat;
  pageOrientation.value = currentCollection.collectionInfo.pageOrientation;
  pageWidth.value = currentCollection.collectionInfo.pageWidth;
  pageHeight.value = currentCollection.collectionInfo.pageHeight;
  pageResolution.value = currentCollection.collectionInfo.resolution;
  cuttingHelp.value = currentCollection.collectionInfo.cuttingHelp;
}

export function checkOtherInputs(eventTargetId, eventTargetValue) {
  switch (eventTargetId) {
    case "elementFormat":
      if (eventTargetValue === "custom") {
        elementHeight.disabled = false;
        elementWidth.disabled = false;
        populateEditionFields();
      } else {
        elementHeight.disabled = true;
        elementWidth.disabled = true;
      }
      break;

    case "pageFormat":
      if (eventTargetValue === "custom") {
        pageWidth.disabled = false;
        pageHeight.disabled = false;
        pageOrientation.disabled = true;
        populateEditionFields();
      } else {
        pageWidth.disabled = true;
        pageHeight.disabled = true;
        pageOrientation.disabled = false;
      }
      break;
  }
}

export function moveElement(currentIndex, delta) {
  var allAccordions = templateItems.querySelectorAll(".accordion");

  var destinationIndex = currentIndex + delta;
  var currentElement = { ...currentCollection.template[currentIndex] };
  var destinationElement = { ...currentCollection.template[destinationIndex] };

  currentCollection.template[destinationIndex] = currentElement;
  currentCollection.template[currentIndex] = destinationElement;

  allAccordions[currentIndex].style.translate = "0 " + 145 * delta + "%";
  allAccordions[destinationIndex].style.translate = "0 " + 145 * -delta + "%";

  setTimeout(() => {
    setupTemplateItems();
  }, 200);
}
