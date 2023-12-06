import {
  currentDeck,
  currentDeckIndex,
  decksAvailable,
  getDecks,
  setCurrentDeckIndex,
} from "./globalStuff.js";
import { renderCardUsingTemplate, triggerGeneration } from "./render.js";
import { app } from "../app.js";

const { existsSync, mkdirSync, copyFileSync } = require("fs");

const rootElement = document.querySelector(":root");
const titleElement = document.getElementById("title");

const startPanel = document.getElementById("startPanel");
const loadingPanel = document.getElementById("loadingPanel");
const editionPanel = document.getElementById("editionPanel");
const canvasPanel = document.getElementById("canvasPanel");

const newBtn = document.getElementById("newBtn");
const loadBtn = document.getElementById("loadBtn");
const renderBtn = document.getElementById("renderBtn");
const duplicateBtn = document.getElementById("duplicateBtn");
const deleteBtn = document.getElementById("deleteBtn");

const bottomBar = document.querySelector(".bottomBar");
const cardCounter = document.getElementById("cardCounter");
const cardCounterLabel = document.getElementById("cardCounterLabel");
const nextCardBtn = document.getElementById("nextCardBtn");
const prevCardBtn = document.getElementById("prevCardBtn");

//COLLECTION PARAMETERS
const collectionName = document.getElementById("collectionName");
const elementFormat = document.getElementById("elementFormat");
const elementWidth = document.getElementById("elementWidth");
const elementHeight = document.getElementById("elementHeight");
const pageFormat = document.getElementById("pageFormat");
const pageOrientation = document.getElementById("pageOrientation");
const pageWidth = document.getElementById("pageWidth");
const pageHeight = document.getElementById("pageHeight");
const pageResolution = document.getElementById("pageResolution");

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

// document.addEventListener("keydown", (e) => {
//   if (e.keyCode == 37) {
//     goToPreviousCard();
//   } else if (e.keyCode == 39) {
//     goToNextCard();
//   }
// });

export function setUI() {
  //MENU
  if (currentDeckIndex == -1) {
    newBtn.style.display = "flex";
    loadBtn.style.display = "flex";
    renderBtn.style.display = "none";
    deleteBtn.style.display = "none";
    duplicateBtn.style.display = "none";
    renderBtn.style.display = "none";
    cardCounter.style.display = "none";
    canvasPanel.style.display = "none";
    titleElement.innerHTML = "LUAP - L'USINE À PROTOS";
    bottomBar.style.display = "none";
  }

  //EDITION
  else {
    newBtn.style.display = "none";
    loadBtn.style.display = "none";
    renderBtn.style.display = "flex";
    deleteBtn.style.display = "flex";
    duplicateBtn.style.display = "flex";
    cardCounter.style.display = "flex";
    homeBtn.style.display = "flex";
    bottomBar.style.display = "flex";
    canvasPanel.style.display = "flex";
    titleElement.innerHTML = currentDeck?.deckInfo.deckName;
    updateCardCounter(app.currentIndex);
  }
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
    renderCardUsingTemplate(app, app.currentIndex);
    updateCardCounter(app.currentIndex);
    rootElement.style.setProperty("--cardAngle", 3 - app.random() * 6 + "deg");
    checkCardButtons();
  }
}

export function goToNextCard() {
  if (app.currentIndex < currentDeck.cards.length - 1) {
    app.currentIndex++;
    renderCardUsingTemplate(app, app.currentIndex);
    updateCardCounter(app.currentIndex);
    rootElement.style.setProperty("--cardAngle", 3 - app.random() * 6 + "deg");
    checkCardButtons();
  }
}

export function createNewDeck() {
  const deckQty = decksAvailable.length;
  var dir = "./src/decks/" + deckQty;

  if (!existsSync(dir)) {
    mkdirSync(dir);
    mkdirSync(dir + "/assets");
    copyFileSync(
      "./src/components/deckTemplate.json",
      "./src/decks/" + deckQty + "/deck.json"
    );
    getDecks();
    setTimeout(() => {
      setCurrentDeckIndex(deckQty);
    }, 100);
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
  elementFormat.value = currentDeck.deckInfo.cardFormat;
  elementWidth.value = currentDeck.deckInfo.cardW / currentDeck.deckInfo.resolution;
  elementHeight.value = currentDeck.deckInfo.cardH / currentDeck.deckInfo.resolution;
  pageFormat.value = currentDeck.deckInfo.pageFormat;
  pageOrientation.value = currentDeck.deckInfo.pageOrientation;
  pageWidth.value = currentDeck.deckInfo.pageW / currentDeck.deckInfo.resolution;
  pageHeight.value = currentDeck.deckInfo.pageH / currentDeck.deckInfo.resolution;
  pageResolution.value = currentDeck.deckInfo.resolution;
}
