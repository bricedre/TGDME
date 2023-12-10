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
    coll.W * coll.resolution,
    coll.H * coll.resolution,
    coll.pageWidth * coll.resolution,
    coll.pageHeight * coll.resolution
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
  coll.elementFormat = elementFormat.value;
  coll.W = elementWidth.value;
  coll.H = elementHeight.value;
  coll.visualGuide = visualGuide.value;
  
  coll.pageFormat = pageFormat.value;
  coll.pageWidth = pageWidth.value;
  coll.pageHeight = pageHeight.value;
  
  coll.pageHeight = pageHeight.value;
  
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
    coll.W * coll.resolution,
    coll.H * coll.resolution,
    coll.pageWidth * coll.resolution,
    coll.pageHeight * coll.resolution
  );

  setTimeout(() => {
    renderCardUsingTemplate(app, app.currentIndex, currentDeck.deckInfo.visualGuide);
    setUI();
  }, 500);
}

function setupCollectionDimensions() {
  var coll = currentDeck.deckInfo;

  switch (coll.elementFormat) {
    case "pokerCard":
      coll.W = 6.3;
      coll.H = 8.8;
      break;

    case "bridgeCard":
      coll.W = 5.7;
      coll.H = 8.9;
      break;

    case "tarotCard":
      coll.W = 7;
      coll.H = 12;
      break;

    case "dominoCard":
      coll.W = 4.4;
      coll.H = 8.8;
      break;

    case "halfCard":
      coll.W = 4.4;
      coll.H = 6.3;
      break;

    case "squareCard":
      coll.W = 8.8;
      coll.H = 8.8;
      break;

    case "hexTileP":
      coll.W = 8.3;
      coll.H = 9.5;
      break;
   
      case "hexTileL":
      coll.W = 9.5;
      coll.H = 8.3;
      break;

    case "smallToken":
      coll.W = 2;
      coll.H = 2;
      break;

    case "mediumToken":
      coll.W = 3;
      coll.H = 3;
      break;

    case "largeToken":
      coll.W = 4;
      coll.H = 4;
      break;
  }

  switch (coll.pageFormat) {
    case "A3":
      coll.pageWidth = 29.7;
      coll.pageHeight = 42;
      break;

    case "A4":
      coll.pageWidth = 21;
      coll.pageHeight = 29.7;
      break;
  }

  if (coll.pageOrientation === "landscape") {
    let _temp = coll.pageWidth;
    coll.pageWidth = coll.pageHeight;
    coll.pageHeight = _temp;
  }

  // DERIVED MARGINS & COLUMN/ROW COUNTS TO CENTER THE CARDS IN THE PAGE
  coll.colCount = Math.floor(coll.pageWidth / coll.W);
  coll.rowCount = Math.floor(coll.pageHeight / coll.H);
  coll.marginX =
    ((coll.pageWidth - coll.W * coll.colCount) / 2) * coll.resolution;
  coll.marginY =
    ((coll.pageHeight - coll.H * coll.rowCount) / 2) * coll.resolution;
}
