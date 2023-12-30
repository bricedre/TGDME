const cloneDeep = require("lodash/cloneDeep");

import { app } from "../app.js";
import { checkOtherInputs, populateEditionFields, setupComponents, setupElements, setupResources, populateComponents, populateElements, updateCardCounter } from "./routes/editionScreen.js";
import { openPanel } from "./routes/mainLayout.js";

import { getFontList, loadAssets } from "./assetLoader.js";
import { imageComponentTemplate, textComponentTemplate, shapeComponentTemplate, elementTemplate } from "./templates.js";
import { renderCardUsingTemplate } from "./render.js";

const fs = require("fs").promises;
const { existsSync, mkdirSync, copyFileSync, readdirSync } = require("fs");
const rimraf = require("rimraf");
const fsExtra = require("fs-extra");

export let collectionsAvailable;
export let currentCollectionUID = -1;
export let currentCollection;

getCollections();
openPanel("start");
getFontList();

export function getCollections() {
  console.log("FN : Récupération des Collections")
  collectionsAvailable = readdirSync("./src/collections", { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  collectionsAvailable.forEach(async (collection, index) => {
    const data = await fs.readFile("./src/collections/" + collection + "/collection.json");
    collectionsAvailable[index] = JSON.parse(data);
  });

  setTimeout(() => {

    loadingPanelDiv.innerHTML = "";

    // Collections to show
    if (collectionsAvailable.length > 0) {

      var activeCollections = collectionsAvailable.filter(col => !col.collectionInfo.archived)
      var archivedCollections = collectionsAvailable.filter(col => col.collectionInfo.archived)

      if (activeCollections.length > 0) {
        var activeCol = document.createElement("div");
        activeCol.id = "activeCollectionsDiv";
        loadingPanelDiv.appendChild(activeCol);

        activeCollections.forEach((collection) => {
          var btnElement = document.createElement("button");
          btnElement.classList.add("deckBtn");
          btnElement.innerHTML = collection.collectionInfo.collectionName;
          btnElement.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            setCurrentCollection(collection.collectionInfo.UID);
          });

          activeCol.appendChild(btnElement);
        });
      }

      if (archivedCollections.length > 0) {

        var archivedColContainer = document.createElement("div");
        archivedColContainer.id = "archivedCollectionsContainer";
        archivedColContainer.addEventListener("click", () => {
          if (archivedColContainer.classList.contains("active")) {
            archivedColContainer.style.maxHeight = "3.2rem";
          } else {
            archivedColContainer.style.maxHeight = "calc(2rem + " + archivedColContainer.scrollHeight + "px)";

          }

          archivedColContainer.classList.toggle("active");
        });
        archivedColContainer.innerHTML = "Collections Archivées";
        loadingPanelDiv.appendChild(archivedColContainer);

        var archivedCol = document.createElement("div");
        archivedCol.id = "archivedCollectionsDiv";
        archivedColContainer.appendChild(archivedCol);

        archivedCollections.forEach((collection) => {
          var btnElement = document.createElement("button");
          btnElement.classList.add("deckBtn");
          btnElement.innerHTML = collection.collectionInfo.collectionName;
          btnElement.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            setCurrentCollection(collection.collectionInfo.UID);
          });

          archivedCol.appendChild(btnElement);
        });
      }


    }

    //No Collections to show
    else {
      var noResourceText = document.createElement("div");
      noResourceText.classList.add("noStuffDiv");
      noResourceText.innerHTML = "Aucune Collection dans votre Bibliothèque<br><br><br><br>Retournez sur la page d'accueil pour en créer une";

      loadingPanelDiv.appendChild(noResourceText);
    }
  }, 500);
}

export function setCurrentCollection(collectionUID) {
  console.log("FN : Définition Collection actuelle")
  currentCollectionUID = collectionUID;
  if (currentCollectionUID != -1) {
    currentCollection = collectionsAvailable.filter((coll) => coll.collectionInfo.UID == collectionUID)[0];

    var coll = currentCollection.collectionInfo;

    loadAssets(app);
    setupCollectionDimensions();
    

    app.setupCanvas(coll.W * coll.resolution, coll.H * coll.resolution, coll.pageWidth * coll.resolution, coll.pageHeight * coll.resolution);

    setTimeout(() => {
      app.currentIndex = 0;
      openPanel("edition");
      populateEditionFields();
      checkOtherInputs(elementFormatSelect.id, elementFormatSelect.value);
      checkOtherInputs(pageFormatSelect.id, pageFormatSelect.value);
      setupResources();
      setupComponents();
      populateComponents();
      setupElements();
      populateElements();
      renderCardUsingTemplate(app, app.currentIndex, currentCollection.collectionInfo.visualGuide);
    }, 500);
  }
}

export function createNewCollection() {
  const newUID = collectionsAvailable.length == 0 ? 0 : collectionsAvailable[collectionsAvailable.length - 1].collectionInfo.UID + 1;
  var dir = "./src/collections/" + newUID;

  if (!existsSync(dir)) {
    mkdirSync(dir);
    mkdirSync(dir + "/assets");
    copyFileSync("./src/components/collectionTemplate.json", "./src/collections/" + newUID + "/collection.json");
    getCollections();

    setTimeout(() => {
      collectionsAvailable[collectionsAvailable.length - 1].collectionInfo.UID = newUID;
      collectionsAvailable[collectionsAvailable.length - 1].collectionInfo.collectionName = "Nouvelle Collection N°" + (newUID + 1);
      var deckToSave = JSON.stringify(collectionsAvailable[collectionsAvailable.length - 1]);
      fs.writeFile("./src/collections/" + newUID + "/collection.json", deckToSave, (err) => {
        if (err) {
          console.error(err);
        }
      });
      setCurrentCollection(newUID);
      addNewElement();
    }, 500);
  }
}

export function deleteCurrentCollection() {
  rimraf
    .rimraf("./src/collections/" + currentCollectionUID)
    .then(() => {
      setCurrentCollection(-1);
      getCollections();
      openPanel("start");
    })
    .catch((e) => console.log(e));

}

export function duplicateCollection() {
  const newUID = collectionsAvailable.length == 0 ? 0 : collectionsAvailable[collectionsAvailable.length - 1].collectionInfo.UID + 1;
  var dir = "./src/collections/" + newUID;

  if (!existsSync(dir)) {
    fsExtra.copy("./src/collections/" + currentCollectionUID, "./src/collections/" + newUID);
    getCollections();

    setTimeout(() => {
      //MODS
      collectionsAvailable[collectionsAvailable.length - 1].collectionInfo.UID = newUID;
      collectionsAvailable[collectionsAvailable.length - 1].collectionInfo.collectionName = "Copie de " + currentCollection.collectionInfo.collectionName;
      var deckToSave = JSON.stringify(collectionsAvailable[collectionsAvailable.length - 1]);
      fs.writeFile("./src/collections/" + newUID + "/collection.json", deckToSave, (err) => {
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
  setTimeout(() => openPanel("loading"), 1000);
}

export function saveCollection(refreshAssets, reRenderCard) {
  console.log("FN : sauvegarde Collection");
  var coll = currentCollection;

  //ALTER THE DATA TO CURRENT DECK
  coll.collectionInfo.collectionName = collectionNameInput.value;
  coll.collectionInfo.elementFormat = elementFormatSelect.value;
  coll.collectionInfo.W = elementWidthInput.value;
  coll.collectionInfo.H = elementHeightInput.value;
  coll.collectionInfo.visualGuide = visualGuideSelect.value;

  coll.collectionInfo.pageFormat = pageFormatSelect.value;
  coll.collectionInfo.pageWidth = pageWidthInput.value;
  coll.collectionInfo.pageHeight = pageHeightInput.value;

  coll.collectionInfo.pageOrientation = pageOrientationSelect.value;
  coll.collectionInfo.resolution = Math.max(1, pageResolutionInput.value);
  coll.collectionInfo.cuttingHelp = cuttingHelpInput.checked;
  
  setupCollectionDimensions();
  populateEditionFields();
  // populateComponents();
  // populateElements();

  //SAVE CURRENT DECK IN FOLDER
  var deckToSave = JSON.stringify(currentCollection);
  fs.writeFile("./src/collections/" + currentCollectionUID + "/collection.json", deckToSave, (err) => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });

  //RELOAD DECK
  if (refreshAssets) loadAssets(app);

  if(reRenderCard){
    setTimeout(() => {
      app.resizeExistingCanvas(
        coll.collectionInfo.W * coll.collectionInfo.resolution,
        coll.collectionInfo.H * coll.collectionInfo.resolution,
        coll.collectionInfo.pageWidth * coll.collectionInfo.resolution,
        coll.collectionInfo.pageHeight * coll.collectionInfo.resolution
      );

      renderCardUsingTemplate(app, app.currentIndex, currentCollection.collectionInfo.visualGuide);
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
  updateComponent();
}

export function addNewText() {
  currentCollection.template.push(cloneDeep(textComponentTemplate));
  updateComponent();
}

export function addNewShape() {
  currentCollection.template.push(cloneDeep(shapeComponentTemplate));
  updateComponent();
}

function updateComponent(){
  currentCollection.template[currentCollection.template.length-1].UID = currentCollection.collectionInfo.lastComponentIndex;
  currentCollection.collectionInfo.lastComponentIndex++;
  setupComponents();
  generateCollectionBtn.click();
}

export function addNewElement() {
  currentCollection.elements.push(cloneDeep(elementTemplate));
  currentCollection.elements[currentCollection.elements.length-1].UID = currentCollection.collectionInfo.lastElementIndex;
  currentCollection.collectionInfo.lastElementIndex++;
  
  setupElements();
  populateElements();
  generateCollectionBtn.click();
  updateCardCounter();
}