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
  setupTemplateItems,
  updateTemplateItems,
  visualGuide,
} from "./DOM.js";
import { loadAssets } from "./assetLoader.js";
import { imageComponentTemplate } from "./imageComponentTemplate.js";
import { renderCardUsingTemplate } from "./render.js";

const fs = require("fs").promises;
const { existsSync, mkdirSync, copyFileSync, readdirSync } = require("fs");

export let decksAvailable;
export let currentCollectionIndex = -1;
export let currentCollection;

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

export function setCurrentCollectionIndex(value) {
  currentCollectionIndex = value;
  if (currentCollectionIndex != -1) setCurrentCollection(decksAvailable[currentCollectionIndex]);
}

function setCurrentCollection(value) {
  currentCollection = value;

  var coll = currentCollection.collectionInfo;

  loadAssets(app);
  setupCollectionDimensions();

  app.setupCanvas(
    coll.W * coll.resolution,
    coll.H * coll.resolution,
    coll.pageWidth * coll.resolution,
    coll.pageHeight * coll.resolution
  );

  setTimeout(() => {
    renderCardUsingTemplate(app, app.currentIndex, currentCollection.collectionInfo.visualGuide);
    setUI();
    openPanel("edition");
    populateEditionFields();
    checkOtherInputs(elementFormat.id, elementFormat.value);
    checkOtherInputs(pageFormat.id, pageFormat.value);
    setupTemplateItems();
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
      setCurrentCollectionIndex(deckQty);
    }, 100);
  }
}

export function saveCollection(refreshAssets) {
  
  var coll = currentCollection;

  //ALTER THE DATA TO CURRENT DECK
  coll.collectionInfo.deckName = collectionName.value;
  coll.collectionInfo.elementFormat = elementFormat.value;
  coll.collectionInfo.W = elementWidth.value;
  coll.collectionInfo.H = elementHeight.value;
  coll.collectionInfo.visualGuide = visualGuide.value;
  
  coll.collectionInfo.pageFormat = pageFormat.value;
  coll.collectionInfo.pageWidth = pageWidth.value;
  coll.collectionInfo.pageHeight = pageHeight.value;
  
  coll.collectionInfo.pageHeight = pageHeight.value;
  
  coll.collectionInfo.pageOrientation = pageOrientation.value;
  coll.collectionInfo.resolution = Math.max(1, pageResolution.value);
  coll.collectionInfo.cuttingHelp = cuttingHelp.checked;

  setupCollectionDimensions();
  populateEditionFields();
  updateTemplateItems();

  //SAVE CURRENT DECK IN FOLDER
  var deckToSave = JSON.stringify(currentCollection);
  fs.writeFile(
    "./src/decks/" + currentCollectionIndex + "/deck.json",
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
    coll.collectionInfo.W * coll.collectionInfo.resolution,
    coll.collectionInfo.H * coll.collectionInfo.resolution,
    coll.collectionInfo.pageWidth * coll.collectionInfo.resolution,
    coll.collectionInfo.pageHeight * coll.collectionInfo.resolution
  );

  setTimeout(() => {
    renderCardUsingTemplate(app, app.currentIndex, currentCollection.collectionInfo.visualGuide);
    setUI();
  }, 500);
}

function setupCollectionDimensions() {
  var coll = currentCollection.collectionInfo;

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
export function addNewImage(){
  currentCollection.template.push({...imageComponentTemplate});
  setupTemplateItems();
  saveCollection(false);
}
export function addNewText(){
  console.log("new text");
  
}
export function addNewStrip(){
  console.log("new strip");
  
}