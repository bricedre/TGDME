import { renderCardUsingTemplate, triggerGeneration } from "./render.js";
import { app, currentCards, currentDeck } from "../app.js";

const { readdirSync, existsSync, mkdirSync} = require("fs");

const getDecks = () =>
  readdirSync("./src/decks", { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const cardCounter = document.getElementById("pageCounter");
const rootElement = document.querySelector(":root");
const canvasPanel = document.getElementById("canvasPanel");

const newBtn = document.getElementById("newBtn");
const loadBtn = document.getElementById("loadBtn");
const saveBtn = document.getElementById("saveBtn");
const renderBtn = document.getElementById("renderBtn");

const pageCounter = document.getElementById("pageCounter");
const nextCardBtn = document.getElementById("nextCardBtn");
const prevCardBtn = document.getElementById("prevCardBtn");

newBtn.addEventListener("click", () => createNewDeck());

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
  console.log(currentDeck)
  if (currentDeck == -1) {
    newBtn.style.display = "flex";
    loadBtn.style.display = "flex";
    saveBtn.style.display = "none";
    renderBtn.style.display = "none";
    pageCounter.style.display = "none";
    canvasPanel.style.display = "none";
  } else {
    newBtn.style.display = "none";
    loadBtn.style.display = "none";
    saveBtn.style.display = "flex";
    renderBtn.style.display = "flex";
    pageCounter.style.display = "flex";
    canvasPanel.style.display = "flex";
  }
}

export function updateCardCounter(currentIndex) {
  //INDEX
  if (currentCards.length > 0) {
    cardCounter.innerHTML =
      "Card #" +
      (currentIndex + 1) +
      " of " +
      currentCards.length +
      " cards - " +
      (currentCards[currentIndex].quantity
        ? currentCards[currentIndex].quantity + " copies"
        : "1 copy");
  } else cardCounter.innerHTML = "NO CARD TO RENDER";
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
  if (app.currentIndex < currentCards.length - 1) {
    app.currentIndex++;
    renderCardUsingTemplate(app, app.currentIndex);
    updateCardCounter(app.currentIndex);
    rootElement.style.setProperty("--cardAngle", 3 - app.random() * 6 + "deg");
    checkButtons();
  }
}

export function createNewDeck() {
  const deckQty = getDecks().length;
  var dir = "./src/decks/"+deckQty;

  if (!existsSync(dir)) {
    mkdirSync(dir);
    currentDeck = deckQty;
    setUI();
  }
}
