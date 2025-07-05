const cloneDeep = require("lodash/cloneDeep");

import { app } from "../app.js";
import { checkOtherInputs, populateEditionFields, updateElementsCounter } from "../screens/editionScreen.js";
import { openScene, setupLangage } from "../screens/mainLayout.js";

import { getFontList, loadAssets } from "./assetsManager.js";
import { imageComponentTemplate, textComponentTemplate, shapeComponentTemplate, titleComponentTemplate } from "./componentTemplates.js";
import { renderCardUsingTemplate, setGlobalVariables } from "./render.js";
import { setupResources } from "./assetsManager.js";
import { populateComponents, setupComponents } from "./componentsManager.js";
import { checkForFileUpdate, updateDataView } from "./elementsManager.js";
import { setupProjectEditionPanel, setupProjectSelectionPanel } from "../screens/menuScreen.js";
import { collectionTemplate } from "./collectionTemplate.js";

const fs = require("fs").promises;
const path = require("path");
const rimraf = require("rimraf");
const fsExtra = require("fs-extra");
const fs2 = require("fs");
const XLSX = require("xlsx");
const getAppDataPath = require("appdata-path");

export let projectsAvailable = [];
export let currentProjectUID = -1;
export let currentProject;

export let collectionsAvailable = [];
export let currentCollectionUID = -1;
export let currentCollection;

export let appDataFolder;

getAppDataFolder();

async function getAppDataFolder() {
  let _appDataFolder = getAppDataPath();

  //First launch
  if (!fs2.existsSync(_appDataFolder + "/Cabane a Protos")) {
    mkdirSync(_appDataFolder + "/Cabane a Protos");
  }

  appDataFolder = _appDataFolder + "/Cabane a Protos";

  if (!fs2.existsSync(appDataFolder + "/projects")) {
    patchIfNotUsingProjectSystem();
  }

  getProjects();
}

async function patchIfNotUsingProjectSystem() {
  if (confirm("NOUVELLE FEATURE - LES PROJETS : L'application va mettre vos données en conformité et s'éteindre d'elle-même. Redémarrez-la ensuite.")) {
    await fs.mkdir(appDataFolder + "/projects");

    await copyDirectoryRecursive(appDataFolder + "/collections", appDataFolder + "/projects");

    const projectsAvailable = await fs.readdir(appDataFolder + "/projects", { withFileTypes: true });
    const projectDirs = projectsAvailable.filter((dirent) => dirent.isDirectory());

    for (const proj of projectDirs) {
      const projectPath = path.join(appDataFolder, "projects", proj.name);
      const collectionsPath = path.join(projectPath, "collections");
      const collection0Path = path.join(collectionsPath, "0");

      await fs.mkdir(collectionsPath, { recursive: true });
      await fs.mkdir(collection0Path);

      const originalCollectionPath = path.join(projectPath, "collection.json");
      const collectionData = await fs.readFile(originalCollectionPath, "utf8");
      const collectionJson = JSON.parse(collectionData);
      const _collectionInfo = collectionJson.collectionInfo;

      const _projectTemplate = {
        UID: _collectionInfo.UID,
        projectName: _collectionInfo.collectionName,
        lastSavingTime: _collectionInfo.lastSavingTime,
        archived: _collectionInfo.archived,
      };

      const projectJsonPath = path.join(projectPath, "project.json");
      await fs.writeFile(projectJsonPath, JSON.stringify(_projectTemplate, null, 2));

      const filesToMove = [
        { from: "collection.json", to: "collections/0/collection.json" },
        { from: "assets", to: "collections/0/assets" },
        { from: "data.xlsx", to: "collections/0/data.xlsx" },
      ];

      for (const file of filesToMove) {
        const fromPath = path.join(projectPath, file.from);
        const toPath = path.join(projectPath, file.to);
        await fs.rename(fromPath, toPath);
      }

      const movedCollectionPath = path.join(projectPath, "collections", "0", "collection.json");
      const movedCollectionData = await fs.readFile(movedCollectionPath, "utf8");
      const movedCollection = JSON.parse(movedCollectionData);
      movedCollection.collectionInfo.UID = "0";
      await fs.writeFile(movedCollectionPath, JSON.stringify(movedCollection, null, 2));
    }

    await fs.rmdir(appDataFolder + "/collections", { recursive: true });

    window.close();
  }
}

// Helper function to copy directory recursively
async function copyDirectoryRecursive(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });

    const entries = await fs.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await copyDirectoryRecursive(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error(`Error copying directory ${src} to ${dest}:`, error);
    throw error;
  }
}

export async function getProjects() {
  projectsAvailable = await getFolderContents(`${appDataFolder}/projects`, "project.json");
  setupProjectSelectionPanel();
}

export async function getCollections() {
  collectionsAvailable = await getFolderContents(`${appDataFolder}/projects/${currentProjectUID}/collections`, "collection.json");
  setupProjectEditionPanel();
}

export async function getFolderContents(path, fileToExplore) {
  let _content;

  try {
    const folderNames = fs2
      .readdirSync(path, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
      .sort((a, b) => {
        return a - b;
      });

    _content = [];
    
    // Use a for loop to process each folder sequentially
    for (const folder of folderNames) {
      const data = await fs.readFile(`${path}/${folder}/${fileToExplore}`);
      _content.push(JSON.parse(data));
    }
  } catch (error) {
    _content = [];
  }

  return _content;
}

export function setCurrentProject(projectUID) {
  currentProjectUID = projectUID;
  currentProject = projectsAvailable.filter((proj) => proj.UID == projectUID)[0];
  getCollections();
  openScene("projectEdition");
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
      populateEditionFields();
      setupResources();
      setupComponents();
      populateComponents();
      updateDataView();
      checkForFileUpdate();
      setGlobalVariables();
      setupLangage();
      renderCardUsingTemplate(app, app.currentIndex, currentCollection.collectionInfo.visualGuide);
      openScene("collectionEdition");
    }, 500);
  }
}

export function createNewCollection() {
  const newUID = collectionsAvailable.length == 0 ? 0 : collectionsAvailable[collectionsAvailable.length - 1].collectionInfo.UID + 1;
  var dir = appDataFolder + "/collections/" + newUID;

  if (!existsSync(dir)) {
    mkdirSync(dir);
    mkdirSync(dir + "/assets");
    mkdirSync(dir + "/renders");
    fs2.writeFileSync(dir + "/collection.json", JSON.stringify(collectionTemplate));

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
      fs.writeFile(dir + "/collection.json", deckToSave, (err) => {
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
    .rimraf(appDataFolder + "/collections/" + currentCollectionUID)
    .then(() => {
      setCurrentCollection(-1);
      getCollections();
      openScene("home");
    })
    .catch((e) => console.log(e));
}

export function duplicateCollection() {
  const newUID = collectionsAvailable.length == 0 ? 0 : collectionsAvailable[collectionsAvailable.length - 1].collectionInfo.UID + 1;
  var dir = appDataFolder + "/collections/" + newUID;

  if (!existsSync(dir)) {
    fsExtra.copy(appDataFolder + "/collections/" + currentCollectionUID, appDataFolder + "/collections/" + newUID);
    getCollections();

    setTimeout(() => {
      collectionsAvailable[collectionsAvailable.length - 1].collectionInfo.UID = newUID;
      collectionsAvailable[collectionsAvailable.length - 1].collectionInfo.collectionName = "Copie de " + currentCollection.collectionInfo.collectionName;
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
  fs.writeFile(`${appDataFolder}/projects/${currentProjectUID}/collections/${currentCollectionUID}/collection.json`, deckToSave, (err) => {
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
