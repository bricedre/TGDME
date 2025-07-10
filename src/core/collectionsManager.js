import { app } from "../app.js";
import { populateEditionFields } from "../screens/editionScreen.js";
import { getFolderContents, openScene } from "../screens/mainLayout.js";

import { loadAssets } from "./assetsManager.js";
import { renderCardUsingTemplate, setCollectionSpecificVariables } from "./render.js";
import { populateComponents, setupComponents } from "./componentsManager.js";
import { loadDataFile, updateDataView } from "./elementsManager.js";
import { setupProjectEditionPanel } from "../screens/menuScreen.js";
import { appDataFolder, currentProject, currentProjectUID } from "./projectsManager.js";
import { collectionTemplate } from "./templates.js";

const fs = require("fs").promises;
const rimraf = require("rimraf");
const fsExtra = require("fs-extra");
const fs2 = require("fs");
const XLSX = require("xlsx");

export let collectionsAvailable = [];
export let currentCollectionUID = -1;
export let currentCollection;
export let currCollInfo;

export async function getCollections() {
  console.log("> getCollections");

  collectionsAvailable = await getFolderContents(`${appDataFolder}/projects/${currentProjectUID}/collections`, "collection.json");
  setupProjectEditionPanel();
}

export function setCurrentCollection(collectionUID) {
  currentCollectionUID = collectionUID;
  if (currentCollectionUID != -1) {
    currentCollection = collectionsAvailable.filter((coll) => coll.collectionInfo.UID == collectionUID)[0];
    currCollInfo = currentCollection.collectionInfo;

    loadAssets(app);
    setupCollectionDimensions();

    app.setupCanvas(
      currCollInfo.W * currCollInfo.resolution,
      currCollInfo.H * currCollInfo.resolution,
      currCollInfo.pageWidth * currCollInfo.resolution,
      currCollInfo.pageHeight * currCollInfo.resolution
    );

    app.currentIndex = 0;
    populateEditionFields();
    setupComponents();
    populateComponents();
    loadDataFile();
    updateDataView();
    setCollectionSpecificVariables();
    setTimeout(() => {
      renderCardUsingTemplate(app, app.currentIndex, currCollInfo.visualGuide);
    }, 500);
  }
}

export function createNewCollection() {
  console.log("> createNewCollection");

  const newUID = getNextCollectionUID();
  var dir = `${appDataFolder}/projects/${currentProjectUID}/collections/${newUID}`;

  console.log(newUID, dir);

  if (!fs2.existsSync(dir)) {
    fs2.mkdirSync(dir);
    fs2.mkdirSync(dir + "/assets");
    fs2.writeFileSync(dir + "/collection.json", JSON.stringify(collectionTemplate(newUID)));

    //CREATE DATA EXCEL SHEET
    const headers = ["donnée 1", "donnée 2"]; // No headers initially
    const data = [["vide", "vide"]]; // No data initially

    const worksheetData = [headers, ...data];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Create the file in the specified collection folder
    const filePath = `${dir}/data.xlsx`;

    // Write the file to the file system
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    fs2.writeFileSync(filePath, Buffer.from(excelBuffer));

    getCollections();
  }
}

function getNextCollectionUID() {
  if (collectionsAvailable.length == 0) return 0;
  else {
    let biggestUID = 0;
    collectionsAvailable.forEach((coll) => {
      if (coll.collectionInfo.UID > biggestUID) biggestUID = parseInt(coll.collectionInfo.UID);
    });
    return biggestUID + 1;
  }
}

export function deleteCurrentCollection() {
  console.log("> deleteCurrentCollection");

  rimraf
    .rimraf(`${appDataFolder}/projects/${currentProjectUID}/collections/${currentCollectionUID}`)
    .then(() => {
      setCurrentCollection(-1);
      getCollections();
      openScene("projectEdition");
    })
    .catch((e) => console.log(e));
}

export function duplicateCollection() {
  console.log("> duplicateCollection");

  const newUID = getNextCollectionUID();
  var dir = `${appDataFolder}/projects/${currentProjectUID}/collections/${newUID}`;

  if (!fs2.existsSync(dir)) {
    fsExtra.copy(`${appDataFolder}/projects/${currentProjectUID}/collections/${currentCollectionUID}`, `${appDataFolder}/projects/${currentProjectUID}/collections/${newUID}`);

    getCollections();

    setTimeout(() => {
      collectionsAvailable[collectionsAvailable.length - 1].collectionInfo.UID = newUID;
      collectionsAvailable[collectionsAvailable.length - 1].collectionInfo.collectionName = "Copie de " + currCollInfo.collectionName;
      var deckToSave = JSON.stringify(collectionsAvailable[collectionsAvailable.length - 1]);
      fs.writeFile(dir + "/collection.json", deckToSave, (err) => {
        if (err) {
          console.error(err);
        }
      });
      getCollections();
      setCurrentCollection(newUID);
      openScene("collectionEdition");
    }, 500);
  }
}

export function archiveCollection() {
  console.log("> archiveCollection");

  currCollInfo.archived = !currCollInfo.archived;
  saveProject(false, false);
  setCurrentCollection(-1);
  setTimeout(() => getCollections(), 300);
  setTimeout(() => openScene("projectEdition"), 1000);
}

export function saveProject(refreshAssets, reRenderCard) {
  console.log("> saveProject");

  var collInfo = currCollInfo;

  //ALTER THE DATA TO CURRENT DECK
  collInfo.collectionName = collectionNameInput.value;
  collInfo.elementFormat = elementFormatSelect.value;
  collInfo.W = elementWidthInput.value;
  collInfo.H = elementHeightInput.value;
  collInfo.visualGuide = visualGuideSelect.value;

  collInfo.pageExportFormat = pageExportFormatSelect.value;
  collInfo.pageFormat = pageFormatSelect.value;
  collInfo.pageWidth = pageWidthInput.value;
  collInfo.pageHeight = pageHeightInput.value;
  collInfo.maxElementQty = maxElementQty.value;

  collInfo.pageOrientation = pageOrientationSelect.value;
  collInfo.resolution = Math.max(1, pageResolutionInput.value);
  collInfo.cuttingHelp = cuttingHelpInput.checked;

  collInfo.lastSavingTime = Date.now();

  populateEditionFields();

  //SAVE CURRENT COLLECTION IN FOLDER
  var deckToSave = JSON.stringify(currentCollection);
  fs.writeFile(`${appDataFolder}/projects/${currentProjectUID}/collections/${currentCollectionUID}/collection.json`, deckToSave, (err) => {
    if (err) {
      console.error(err);
    }
  });

  //SAVE CURRENT PROJECT IN FOLDER
  currentProject.lastSavingTime = Date.now();
  var projectToSave = JSON.stringify(currentProject);
  fs.writeFile(`${appDataFolder}/projects/${currentProjectUID}/project.json`, projectToSave, (err) => {
    if (err) {
      console.error(err);
    }
  });

  //RELOAD DECK
  if (refreshAssets) loadAssets(app);

  if (reRenderCard) {
    setTimeout(() => {
      app.resizeExistingCanvas(collInfo.W * collInfo.resolution, collInfo.H * collInfo.resolution, collInfo.pageWidth * collInfo.resolution, collInfo.pageHeight * collInfo.resolution);

      renderCardUsingTemplate(app, app.currentIndex, collInfo.visualGuide);
    }, 500);
  }
}

export function setupCollectionDimensions() {
  console.log("> setupCollectionDimensions");

  var coll = currCollInfo;

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

    case "TTS":
      coll.pageWidth = Math.round(coll.W * 100) / 10;
      coll.pageHeight = Math.round(coll.H * 70) / 10;
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
  coll.marginX = ((coll.pageWidth - coll.W * coll.colCount) / 2) * coll.resolution;
  coll.marginY = ((coll.pageHeight - coll.H * coll.rowCount) / 2) * coll.resolution;
}
