import { app } from "../app.js";
import {
  checkOtherInputs,
  collectionName,
  cuttingHelp,
  elementFormat,
  elementHeight,
  elementWidth,
  openPanel,
  pageFormat,
  pageHeight,
  pageResolution,
  pageWidth,
  populateEditionFields,
  setUI,
  updateTemplateItems,
  visualGuide,
} from "./DOM.js";
import { loadAssets } from "./assetLoader.js";
import { renderCardUsingTemplate } from "./render.js";

const fs = require("fs").promises;
const { existsSync, mkdirSync, copyFileSync, readdirSync } = require("fs");

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

  var coll = currentDeck.deckInfo;

  loadAssets(app);
  setupCollectionDimensions();

  app.setupCanvas(
    coll.cardW * coll.resolution,
    coll.cardH * coll.resolution,
    coll.pageW * coll.resolution,
    coll.pageH * coll.resolution
  );

  setTimeout(() => {
    renderCardUsingTemplate(app, app.currentIndex, currentDeck.deckInfo.visualGuide);
    setUI();
    openPanel("edition");
    populateEditionFields();
    checkOtherInputs(elementFormat.id, elementFormat.value);
    checkOtherInputs(pageFormat.id, pageFormat.value);
    updateTemplateItems();
  }, 500);
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

export function saveDeck(refreshAssets) {
  
  var coll = currentDeck.deckInfo;

  //ALTER THE DATA TO CURRENT DECK
  coll.deckName = collectionName.value;
  coll.cardFormat = elementFormat.value;
  coll.cardW = elementWidth.value;
  coll.cardH = elementHeight.value;
  coll.visualGuide = visualGuide.value;
  
  coll.pageFormat = pageFormat.value;
  coll.pageW = pageWidth.value;
  coll.pageH = pageHeight.value;
  
  coll.pageH = pageHeight.value;
  
  coll.pageOrientation = pageOrientation.value;
  coll.resolution = Math.max(1, pageResolution.value);
  coll.cuttingHelp = cuttingHelp.checked;

  setupCollectionDimensions();
  populateEditionFields();

  //SAVE CURRENT DECK IN FOLDER
  var deckToSave = JSON.stringify(currentDeck);
  fs.writeFile(
    "./src/decks/" + currentDeckIndex + "/deck.json",
    deckToSave,
    (err) => {
      if (err) {
        console.error(err);
      }
      // file written successfully
    }
  );

  //RELOAD DECK
  if (refreshAssets) loadAssets(app);

  app.resizeExistingCanvas(
    coll.cardW * coll.resolution,
    coll.cardH * coll.resolution,
    coll.pageW * coll.resolution,
    coll.pageH * coll.resolution
  );

  setTimeout(() => {
    renderCardUsingTemplate(app, app.currentIndex, currentDeck.deckInfo.visualGuide);
    setUI();
  }, 500);
}

function setupCollectionDimensions() {
  var coll = currentDeck.deckInfo;

  switch (coll.cardFormat) {
    case "pokerCard":
      coll.cardW = 6.3;
      coll.cardH = 8.8;
      break;

    case "bridgeCard":
      coll.cardW = 5.7;
      coll.cardH = 8.9;
      break;

    case "tarotCard":
      coll.cardW = 7;
      coll.cardH = 12;
      break;

    case "dominoCard":
      coll.cardW = 4.4;
      coll.cardH = 8.8;
      break;

    case "halfCard":
      coll.cardW = 4.4;
      coll.cardH = 6.3;
      break;

    case "squareCard":
      coll.cardW = 8.8;
      coll.cardH = 8.8;
      break;

    case "hexTileP":
      coll.cardW = 8.3;
      coll.cardH = 9.5;
      break;
   
      case "hexTileL":
      coll.cardW = 9.5;
      coll.cardH = 8.3;
      break;

    case "smallToken":
      coll.cardW = 2;
      coll.cardH = 2;
      break;

    case "mediumToken":
      coll.cardW = 3;
      coll.cardH = 3;
      break;

    case "largeToken":
      coll.cardW = 4;
      coll.cardH = 4;
      break;
  }

  switch (coll.pageFormat) {
    case "A3":
      coll.pageW = 29.7;
      coll.pageH = 42;
      break;

    case "A4":
      coll.pageW = 21;
      coll.pageH = 29.7;
      break;
  }

  if (coll.pageOrientation === "landscape") {
    let _temp = coll.pageW;
    coll.pageW = coll.pageH;
    coll.pageH = _temp;
  }

  // DERIVED MARGINS & COLUMN/ROW COUNTS TO CENTER THE CARDS IN THE PAGE
  coll.colCount = Math.floor(coll.pageW / coll.cardW);
  coll.rowCount = Math.floor(coll.pageH / coll.cardH);
  coll.marginX =
    ((coll.pageW - coll.cardW * coll.colCount) / 2) * coll.resolution;
  coll.marginY =
    ((coll.pageH - coll.cardH * coll.rowCount) / 2) * coll.resolution;
}
