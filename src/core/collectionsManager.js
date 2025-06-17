const cloneDeep = require("lodash/cloneDeep");

import { app } from "../app.js";
import { checkOtherInputs, populateEditionFields, updateElementsCounter } from "../screens/editionScreen.js";
import { openScene } from "../screens/mainLayout.js";

import { getFontList, loadAssets } from "./assetsManager.js";
import { imageComponentTemplate, textComponentTemplate, shapeComponentTemplate, titleComponentTemplate } from "./componentTemplates.js";
import { renderCardUsingTemplate, setGlobalVariables } from "../render.js";
import { setupResources } from "./assetsManager.js";
import { populateComponents, setupComponents } from "./componentsManager.js";
import { checkForFileUpdate, updateDataView } from "./elementsManager.js";
import { setupMenu } from "../screens/menuScreen.js";

const { rootPath } = require("electron-root-path");
const fs = require("fs").promises;
const { existsSync, mkdirSync, copyFileSync, readdirSync } = require("fs");
const rimraf = require("rimraf");
const fsExtra = require("fs-extra");
const fs2 = require("fs");
const XLSX = require("xlsx");

export let collectionsAvailable;
export let currentCollectionUID = -1;
export let currentCollection;

getCollections();

export function getCollections() {
  try{

    collectionsAvailable = readdirSync(rootPath + "/collections", { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .sort((a, b) => {
      return a - b;
    });
    
    collectionsAvailable.forEach(async (collection, index) => {
      const data = await fs.readFile(rootPath + "/collections/" + collection + "/collection.json");
      collectionsAvailable[index] = JSON.parse(data);
    });
  }
  catch (error){
    collectionsAvailable = [];
    console.log(error)
  }

  setTimeout(() => {
    setupMenu();
  }, 500);
}

export function setCurrentCollection(collectionUID) {
  currentCollectionUID = collectionUID;
  if (currentCollectionUID != -1) {
    currentCollection = collectionsAvailable.filter((coll) => coll.collectionInfo.UID == collectionUID)[0];

    var coll = currentCollection.collectionInfo;

    loadAssets(app);
    setupCollectionDimensions();

    app.setupCanvas(coll.W * coll.resolution, coll.H * coll.resolution, coll.pageWidth * coll.resolution, coll.pageHeight * coll.resolution);

    setTimeout(() => {
      app.currentIndex = 0;
      openScene("collectionEdition");
      populateEditionFields();
      setupResources();
      setupComponents();
      populateComponents();
      updateDataView();
      checkForFileUpdate();
      setGlobalVariables();
      renderCardUsingTemplate(app, app.currentIndex, currentCollection.collectionInfo.visualGuide);
    }, 500);
  }
}

export function createNewCollection() {
  const newUID = collectionsAvailable.length == 0 ? 0 : collectionsAvailable[collectionsAvailable.length - 1].collectionInfo.UID + 1;
  var dir = rootPath + "/collections/" + newUID;

  const collectionTemplatePath = rootPath + "/src/core/collectionTemplate.json";

  if (!existsSync(dir)) {
    mkdirSync(dir);
    mkdirSync(dir + "/assets");
    mkdirSync(dir + "/renders");
    copyFileSync(collectionTemplatePath, rootPath + "/collections/" + newUID + "/collection.json");

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

    setTimeout(() => {
      collectionsAvailable[collectionsAvailable.length - 1].collectionInfo.UID = newUID;
      collectionsAvailable[collectionsAvailable.length - 1].collectionInfo.collectionName = "Nouveau Proto";
      var deckToSave = JSON.stringify(collectionsAvailable[collectionsAvailable.length - 1]);
      fs.writeFile(rootPath + "/collections/" + newUID + "/collection.json", deckToSave, (err) => {
        if (err) {
          console.error(err);
        }
      });
      setCurrentCollection(newUID);
    }, 500);
  }
}

export function deleteCurrentCollection() {
  rimraf
    .rimraf("./collections/" + currentCollectionUID)
    .then(() => {
      setCurrentCollection(-1);
      getCollections();
      openScene("home");
    })
    .catch((e) => console.log(e));
}

export function duplicateCollection() {
  const newUID = collectionsAvailable.length == 0 ? 0 : collectionsAvailable[collectionsAvailable.length - 1].collectionInfo.UID + 1;
  var dir = "./collections/" + newUID;

  if (!existsSync(dir)) {
    fsExtra.copy("./collections/" + currentCollectionUID, "./collections/" + newUID);
    getCollections();

    setTimeout(() => {
      //MODS
      collectionsAvailable[collectionsAvailable.length - 1].collectionInfo.UID = newUID;
      collectionsAvailable[collectionsAvailable.length - 1].collectionInfo.collectionName = "Copie de " + currentCollection.collectionInfo.collectionName;
      var deckToSave = JSON.stringify(collectionsAvailable[collectionsAvailable.length - 1]);
      fs.writeFile("./collections/" + newUID + "/collection.json", deckToSave, (err) => {
        if (err) {
          console.error(err);
        }
      });
      setCurrentCollection(newUID);
      getCollections();
    }, 500);
  }
}

export function archiveCollection() {
  currentCollection.collectionInfo.archived = !currentCollection.collectionInfo.archived;
  saveCollection(false, false);
  setCurrentCollection(-1);
  setTimeout(() => getCollections(), 300);
  setTimeout(() => openScene("home"), 1000);
}

export function saveCollection(refreshAssets, reRenderCard) {
  var collInfo = currentCollection.collectionInfo;

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

  setupCollectionDimensions();
  populateEditionFields();

  //SAVE CURRENT DECK IN FOLDER
  var deckToSave = JSON.stringify(currentCollection);
  fs.writeFile(rootPath + "/collections/" + currentCollectionUID + "/collection.json", deckToSave, (err) => {
    if (err) {
      console.error(err);
    }
    // file written successfully
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

export function addNewImage() {
  currentCollection.template.push(cloneDeep(imageComponentTemplate));
  assignUIDToNewComponent();
}

export function addNewText() {
  currentCollection.template.push(cloneDeep(textComponentTemplate));
  assignUIDToNewComponent();
}

export function addNewTitle() {
  currentCollection.template.push(cloneDeep(titleComponentTemplate));
  assignUIDToNewComponent();
}

export function addNewShape() {
  currentCollection.template.push(cloneDeep(shapeComponentTemplate));
  assignUIDToNewComponent();
}

function assignUIDToNewComponent() {
  currentCollection.template[currentCollection.template.length - 1].UID = currentCollection.collectionInfo.lastComponentIndex;
  currentCollection.collectionInfo.lastComponentIndex++;
  setupComponents();
  generateCollectionBtn.click();
}
