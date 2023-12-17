import { app } from "../../app.js";
import { addNewImage, addNewStrip, addNewText, currentCollection, saveCollection } from "../collectionManager.js";
import { rootElement } from "./mainLayout.js";
import { IMAGE_parameters, TEXT_parameters, STRIP_parameters } from "../elementsParameters.js";
import { renderCardUsingTemplate } from "../render.js";

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

const imageTemplateBtn = document.getElementById("imageTemplateBtn");
const stripTemplateBtn = document.getElementById("stripTemplateBtn");
const textTemplateBtn = document.getElementById("textTemplateBtn");
const duplicateBtn = document.getElementById("duplicateBtn");
const deleteBtn = document.getElementById("deleteBtn");
const renderBtn = document.getElementById("renderBtn");


const cardCounterLabel = document.getElementById("cardCounterLabel");
const bigNextCardBtn = document.getElementById("bigNextCardBtn");
const nextCardBtn = document.getElementById("nextCardBtn");
const prevCardBtn = document.getElementById("prevCardBtn");
const bigPrevCardBtn = document.getElementById("bigPrevCardBtn");

const templateItems = document.getElementById("templateItems");
const elementItems = document.getElementById("elementItems");


renderBtn.addEventListener("click", () => {
  triggerGeneration(app);
});

generateBtn.addEventListener("click", () => {
  saveCollection(false);
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
    saveCollection(false);
  }, 200);
}
