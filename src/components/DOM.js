import {
  createNewDeck,
  currentDeck,
  currentDeckIndex,
  decksAvailable,
  saveDeck,
  setCurrentDeckIndex,
} from "./globalStuff.js";
import { renderCardUsingTemplate, triggerGeneration } from "./render.js";
import { app } from "../app.js";

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
const nextCardBtn = document.getElementById("nextCardBtn");
const prevCardBtn = document.getElementById("prevCardBtn");

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
  setCurrentDeckIndex(-1);
  openPanel("start");
});

newBtn.addEventListener("click", () => createNewDeck());

loadBtn.addEventListener("click", () => {
  while (loadingPanel.firstChild) {
    loadingPanel.removeChild(loadingPanel.lastChild);
  }

  decksAvailable.forEach((deck, index) => {
    var btnElement = document.createElement("button");
    btnElement.classList.add("deckBtn");
    btnElement.innerHTML = deck.deckInfo.deckName;
    btnElement.addEventListener("click", () => {
      setCurrentDeckIndex(index);
    });

    loadingPanel.appendChild(btnElement);
  });

  openPanel("loading");
  titleElement.innerHTML = "BIBLIOTHÈQUE DE COLLECTIONS";
});

renderBtn.addEventListener("click", () => {
  triggerGeneration(app);
});

nextCardBtn.addEventListener("click", () => {
  goToNextCard();
});

prevCardBtn.addEventListener("click", () => {
  goToPreviousCard();
});

allInputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    saveDeck(false);
    checkOtherInputs(e.target.id, e.target.value);
  });
});

allSelects.forEach((select) => {
  select.addEventListener("change", (e) => {
    saveDeck(false);
    checkOtherInputs(e.target.id, e.target.value);
  });
});

//
// FUNCTIONS
//

export function setUI() {
  //MENU
  if (currentDeckIndex == -1) {
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
    newBtn.style.display = "none";
    loadBtn.style.display = "none";
    renderBtn.style.display = "flex";
    deleteBtn.style.display = "flex";
    duplicateBtn.style.display = "flex";
    textTemplateBtn.style.display = "flex";
    stripTemplateBtn.style.display = "flex";
    imageTemplateBtn.style.display = "flex";
    cardCounter.style.display = "flex";
    homeBtn.style.display = "flex";
    bottomBar.style.display = "flex";
    canvasPanel.style.display = "flex";
    titleElement.innerHTML = currentDeck?.deckInfo.deckName;
    updateCardCounter(app.currentIndex);
  }
}

export function updateTemplateItems() {
  while (templateItems.firstChild) {
    templateItems.removeChild(templateItems.lastChild);
  }

  var IMAGE_parameters = [
    { name: "Informations Générales", type: "spacer" },
    { name: "Nom du Composant ", refValue: "componentName", type: "text" },
    { name: "Source de l'Image ", refValue: "src", type: "text" },
    { name: "Visible ?", refValue: "isVisible", type: "checkbox" },
    { name: "Positionnement, Dimensions et Rotation", type: "spacer" },
    {
      name: "Ancre",
      refValue: "anchor",
      type: "select",
      options: [
        { value: "CENTER", label: "CENTRE" },
        { value: "CORNER", label: "COIN SUPÉRIEUR GAUCHE" },
      ],
    },
    { name: "Position Horizontale", refValue: "position_x", type: "text" },
    { name: "Position Verticale", refValue: "position_y", type: "text" },
    { name: "Largeur", refValue: "width", type: "text" },
    { name: "Hauteur", refValue: "height", type: "text" },
    { name: "Rotation", refValue: "angle", type: "text" },
    { name: "Paramètres Avancés", type: "spacer" },
    { name: "Déclencheur", refValue: "trigger", type: "text" },
    { name: "Filtre de Teinte", refValue: "tint", type: "color" },
  ];
  var TEXT_parameters = [];
  var STRIP_parameters = [];

  currentDeck.template.forEach((item) => {
    var itemAccordion = document.createElement("button");
    itemAccordion.style.display = "block";
    itemAccordion.classList.add("accordion");

    var icon;
    var parametersToLoad;
    switch (item.element) {
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
      "<img src='" + icon + "'><span>" + item.componentName + "</span>";

    itemAccordion.addEventListener("click", function () {
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

    parametersToLoad.forEach((param) => {
      var parameterSlot = document.createElement("div");
      parameterSlot.classList.add("parameterSlot");

      var parameterName = document.createElement("p");
      parameterName.classList.add("parameterName");
      parameterName.innerHTML = param.name;

      var parameterInput = document.createElement("input");
      var inputID = param.refValue + Math.floor(Math.random() * 999999);
      parameterInput.id = inputID;

      if (param.type !== "spacer") {
        if (param.type === "checkbox") {
          parameterInput.type = param.type;
          parameterInput.checked = item[param.refValue];
          parameterName = document.createElement("label");
          parameterName.setAttribute("for", inputID);
          parameterName.classList.add("parameterName");
          parameterName.innerHTML = param.name;
          parameterSlot.appendChild(parameterInput);
          parameterSlot.appendChild(parameterName);
        } else if (param.type === "select") {
          parameterInput = document.createElement("select");
          parameterInput.classList.add("parameterInput");
          param.options.forEach((opt) => {
            var option = document.createElement("option");
            option.value = opt.value;
            option.innerHTML = opt.label;
            parameterInput.appendChild(option);
          });
          parameterInput.value = item[param.refValue];
          parameterSlot.appendChild(parameterName);
          parameterSlot.appendChild(parameterInput);
        } else {
          parameterInput.classList.add("parameterInput");
          if(param.type === "color") parameterInput.style.padding = "0.2rem"
          parameterInput.type = param.type;
          parameterInput.value = item[param.refValue];
          parameterSlot.appendChild(parameterName);
          parameterSlot.appendChild(parameterInput);
        }
      } else {
        parameterName.classList.add("spacer");
        parameterSlot.appendChild(parameterName);
      }

      itemPanel.appendChild(parameterSlot);
    });

    templateItems.appendChild(itemAccordion);
    templateItems.appendChild(itemPanel);
  });
}

export function updateCardCounter(currentIndex) {
  //INDEX
  if (currentDeck.cards.length > 0) {
    cardCounterLabel.innerHTML =
      "Élément #" +
      (currentIndex + 1) +
      " sur " +
      currentDeck.cards.length +
      " - " +
      (currentDeck.cards[currentIndex].quantity
        ? currentDeck.cards[currentIndex].quantity + " copies"
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
    currentDeck.cards.length > 0 &&
    app.currentIndex != currentDeck.cards.length - 1
  )
    nextCardBtn.disabled = false;
  else nextCardBtn.disabled = true;
}

export function goToPreviousCard() {
  if (app.currentIndex > 0) {
    app.currentIndex--;
    renderCardUsingTemplate(
      app,
      app.currentIndex,
      currentDeck.deckInfo.visualGuide
    );
    updateCardCounter(app.currentIndex);
    rootElement.style.setProperty("--cardAngle", 3 - app.random() * 6 + "deg");
    checkCardButtons();
  }
}

export function goToNextCard() {
  if (app.currentIndex < currentDeck.cards.length - 1) {
    app.currentIndex++;
    renderCardUsingTemplate(
      app,
      app.currentIndex,
      currentDeck.deckInfo.visualGuide
    );
    updateCardCounter(app.currentIndex);
    rootElement.style.setProperty("--cardAngle", 3 - app.random() * 6 + "deg");
    checkCardButtons();
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

export function populateEditionFields() {
  collectionName.value = currentDeck.deckInfo.deckName;
  elementFormat.value = currentDeck.deckInfo.elementFormat;
  elementWidth.value = currentDeck.deckInfo.W;
  elementHeight.value = currentDeck.deckInfo.H;
  visualGuide.value = currentDeck.deckInfo.visualGuide;

  pageFormat.value = currentDeck.deckInfo.pageFormat;
  pageOrientation.value = currentDeck.deckInfo.pageOrientation;
  pageWidth.value = currentDeck.deckInfo.pageWidth;
  pageHeight.value = currentDeck.deckInfo.pageHeight;
  pageResolution.value = currentDeck.deckInfo.resolution;
  cuttingHelp.value = currentDeck.deckInfo.cuttingHelp;
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
