import { app } from "../app.js";
import { openPanel, populateEditionFields, setUI } from "./DOM.js";
import { loadAssets } from "./assetLoader.js";
import { renderCardUsingTemplate } from "./render.js";

const fs = require("fs").promises;
const { readdirSync } = require("fs");

export let decksAvailable;
export let currentDeckIndex = -1;
export let currentDeck;

getDecks();
openPanel("start");

export function getDecks() {
  decksAvailable = readdirSync("./src/decks", { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  decksAvailable.forEach(async (deck, index) => {
    const data = await fs.readFile("./src/decks/" + deck + "/deck.json");
    decksAvailable[index] = JSON.parse(data);
  });
}

export function setCurrentDeckIndex(value) {
  currentDeckIndex = value;
  if (currentDeckIndex != -1) setCurrentDeck(decksAvailable[currentDeckIndex]);
}

function setCurrentDeck(value) {
  currentDeck = value;
  loadAssets(app);
  setupDeckValues();
  app.setupCanvas(
    currentDeck.deckInfo.cardW,
    currentDeck.deckInfo.cardH,
    currentDeck.deckInfo.pageW,
    currentDeck.deckInfo.pageH
  );

  setTimeout(() => {
    renderCardUsingTemplate(app, app.currentIndex);
    setUI();
    openPanel("edition");
    populateEditionFields();
  }, 500);
}

function setupDeckValues() {
  console.log(currentDeck);
  switch (currentDeck.deckInfo.cardFormat) {
    case "pokerCard":
      currentDeck.deckInfo.cardW = Math.round(
        6.3 * currentDeck.deckInfo.resolution
      );
      currentDeck.deckInfo.cardH = Math.round(
        8.8 * currentDeck.deckInfo.resolution
      );
      break;

    case "tarotCard":
      currentDeck.deckInfo.cardW = Math.round(
        6.3 * currentDeck.deckInfo.resolution
      );
      currentDeck.deckInfo.cardH = Math.round(
        8.8 * currentDeck.deckInfo.resolution
      );
      break;

    case "squareCard":
      currentDeck.deckInfo.cardW = Math.round(
        8.8 * currentDeck.deckInfo.resolution
      );
      currentDeck.deckInfo.cardH = Math.round(
        8.8 * currentDeck.deckInfo.resolution
      );
      break;

    case "dominoCard":
      currentDeck.deckInfo.cardW = Math.round(
        4.4 * currentDeck.deckInfo.resolution
      );
      currentDeck.deckInfo.cardH = Math.round(
        8.8 * currentDeck.deckInfo.resolution
      );
      break;

    case "custom":
    default:
      currentDeck.deckInfo.cardW = Math.round(
        currentDeck.deckInfo.cardW * currentDeck.deckInfo.resolution
      );
      currentDeck.deckInfo.cardH = Math.round(
        currentDeck.deckInfo.cardH * currentDeck.deckInfo.resolution
      );
      break;
  }

  if (currentDeck.deckInfo.cardOrientation === "landscape") {
    let _temp = currentDeck.deckInfo.cardW;
    currentDeck.deckInfo.cardW = cardH;
    currentDeck.deckInfo.cardH = _temp;
  }

  switch (currentDeck.deckInfo.pageFormat) {
    case "A3":
      currentDeck.deckInfo.pageW = Math.round(
        29.7 * currentDeck.deckInfo.resolution
      );
      currentDeck.deckInfo.pageH = Math.round(
        42 * currentDeck.deckInfo.resolution
      );
      break;

    case "A4":
      currentDeck.deckInfo.pageW = Math.round(
        21 * currentDeck.deckInfo.resolution
      );
      currentDeck.deckInfo.pageH = Math.round(
        29.7 * currentDeck.deckInfo.resolution
      );
      break;

    case "custom":
    default:
      currentDeck.deckInfo.pageW = Math.round(
        currentDeck.deckInfo.pageW * currentDeck.deckInfo.resolution
      );
      currentDeck.deckInfo.pageH = Math.round(
        currentDeck.deckInfo.pageH * currentDeck.deckInfo.resolution
      );
      break;
  }

  if (currentDeck.deckInfo.pageOrientation === "landscape") {
    let _temp = currentDeck.deckInfo.pageW;
    currentDeck.deckInfo.pageW = pageH;
    currentDeck.deckInfo.pageH = _temp;
  }

  // DERIVED MARGINS & COLUMN/ROW COUNTS TO CENTER THE CARDS IN THE PAGE
  currentDeck.deckInfo.colCount = Math.floor(
    currentDeck.deckInfo.pageW / currentDeck.deckInfo.cardW
  );
  currentDeck.deckInfo.rowCount = Math.floor(
    currentDeck.deckInfo.pageH / currentDeck.deckInfo.cardH
  );
  currentDeck.deckInfo.marginX =
    (currentDeck.deckInfo.pageW -
      currentDeck.deckInfo.cardW * currentDeck.deckInfo.colCount) /
    2;
  currentDeck.deckInfo.marginY =
    (currentDeck.deckInfo.pageH -
      currentDeck.deckInfo.cardH * currentDeck.deckInfo.rowCount) /
    2;
}
