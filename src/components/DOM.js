import {
  currentDeck,
  currentDeckIndex,
  setCurrentDeckIndex,
} from "./globalStuff.js";
import { renderCardUsingTemplate, triggerGeneration } from "./render.js";
import { app } from "../app.js";

const { readdirSync, existsSync, mkdirSync, copyFileSync } = require("fs");

const cardCounter = document.getElementById("pageCounter");
const rootElement = document.querySelector(":root");
const titleElement = document.getElementById("title");

const startPanel = document.getElementById("startPanel");
const loadingPanel = document.getElementById("loadingPanel");
const editionPanel = document.getElementById("editionPanel");
const canvasPanel = document.getElementById("canvasPanel");

const newBtn = document.getElementById("newBtn");
const loadBtn = document.getElementById("loadBtn");
const saveBtn = document.getElementById("saveBtn");
const renderBtn = document.getElementById("renderBtn");

const pageCounter = document.getElementById("pageCounter");
const nextCardBtn = document.getElementById("nextCardBtn");
const prevCardBtn = document.getElementById("prevCardBtn");

homeBtn.addEventListener("click", () => {
  loadExistingDeck(-1);
  openPanel("start");
});

newBtn.addEventListener("click", () => createNewDeck());
loadBtn.addEventListener("click", () => {
  while (loadingPanel.firstChild) {
    loadingPanel.removeChild(loadingPanel.lastChild);
  }
  var decksAvailable = getDecks();

  decksAvailable.forEach((deck, index) => {
    
    var btnElement = document.createElement("button");
    btnElement.innerHTML = index;
    btnElement.addEventListener("click", () => {
      setCurrentDeckIndex(index);
      openPanel("edition");
    })
    loadingPanel.appendChild(btnElement);
  })

  openPanel("loading");
  titleElement.innerHTML = "BIBLIOTHÈQUE";
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

document.addEventListener("keydown", (e) => {
  if (e.keyCode == 37) {
    goToPreviousCard();
  } else if (e.keyCode == 39) {
    goToNextCard();
  }
});

export function setUI() {
  if (currentDeckIndex == -1) {
    newBtn.style.display = "flex";
    loadBtn.style.display = "flex";
    saveBtn.style.display = "none";
    renderBtn.style.display = "none";
    pageCounter.style.display = "none";
    canvasPanel.style.display = "none";
    titleElement.innerHTML = "LOGICIEL TROP BIEN !";
  } else {
    newBtn.style.display = "none";
    loadBtn.style.display = "none";
    saveBtn.style.display = "flex";
    renderBtn.style.display = "flex";
    pageCounter.style.display = "flex";
    canvasPanel.style.display = "flex";
    titleElement.innerHTML = currentDeck?.deckInfo.deckName;
  }
}

export function updateCardCounter(currentIndex) {
  //INDEX
  if (currentDeck.cards.length > 0) {
    cardCounter.innerHTML =
      "Carte #" +
      (currentIndex + 1) +
      " sur " +
      currentDeck.cards.length +
      " cartes - " +
      (currentDeck.cards[currentIndex].quantity
        ? currentDeck.cards[currentIndex].quantity + " copies"
        : "1 copie");
  } else cardCounter.innerHTML = "PAS DE CARTE À AFFICHER";
}

export function checkButtons() {
  if (app.currentIndex != 0) prevCardBtn.disabled = false;
  else prevCardBtn.disabled = true;

  if (app.currentIndex != currentCards.length - 1) nextCardBtn.disabled = false;
  else nextCardBtn.disabled = true;
}

export function goToPreviousCard() {
  if (app.currentIndex > 0) {
    app.currentIndex--;
    renderCardUsingTemplate(app, app.currentIndex);
    updateCardCounter(app.currentIndex);
    rootElement.style.setProperty("--cardAngle", 3 - app.random() * 6 + "deg");
    checkButtons();
  }
}

export function goToNextCard() {
  if (app.currentIndex < currentDeck.cards.length - 1) {
    app.currentIndex++;
    renderCardUsingTemplate(app, app.currentIndex);
    updateCardCounter(app.currentIndex);
    rootElement.style.setProperty("--cardAngle", 3 - app.random() * 6 + "deg");
    checkButtons();
  }
}

const getDecks = () =>
  readdirSync("./src/decks", { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

export function createNewDeck() {
  const deckQty = getDecks().length;
  var dir = "./src/decks/" + deckQty;

  if (!existsSync(dir)) {
    mkdirSync(dir);
    mkdirSync(dir + "/assets");
    copyFileSync(
      "./src/components/deckTemplate.json",
      "./src/decks/" + deckQty + "/deck.json"
    );
    setCurrentDeckIndex(deckQty);

    setUI();
    openPanel("edition");
  }
}

openPanel("start")

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
}

export function loadExistingDeck(index) {
  setCurrentDeckIndex(index);
  setUI();
}
