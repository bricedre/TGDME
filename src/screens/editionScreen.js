import { app } from "../app.js";
import { addNewImage, addNewShape, addNewText, archiveCollection, currentCollection, deleteCurrentCollection, duplicateCollection, saveCollection } from "../core/collectionsManager.js";
import { rootElement } from "./mainLayout.js";
import { renderCardUsingTemplate } from "../render.js";
import { allSystemFonts, loadAssets, openCurrentResFolder } from "../core/assetsManager.js";
import { setupComponents } from "../core/componentsManager.js";
import { checkForFileUpdate, openExcelFile, updateDataView } from "../core/elementsManager.js";

const $ = require("jquery");

//GENERAL BUTTONS
$("#generateCollectionBtn")
  .on("click", () => {
    saveCollection(false, true);
    $("#generateCollectionBtn").css("animation", "0.5s beyblade");
  })
  .on("animationend", () => {
    $("#generateCollectionBtn").css("animation", "none");
  });

$("#bigPrevCardBtn").on("click", () => goToOtherCard(-10));
$("#prevCardBtn").on("click", () => goToOtherCard(-1));
$("#nextCardBtn").on("click", () => goToOtherCard(1));
$("#bigNextCardBtn").on("click", () => goToOtherCard(10));

//TABS BUTTONS
$("#duplicateCollectionBtn").on("click", () => duplicateCollection());
$("#archiveCollectionBtn").on("click", () => archiveCollection());
$("#deleteCollectionBtn").on("click", () => deleteCurrentCollection());

$("#openResFolderBtn").on("click", () => openCurrentResFolder());
$("#reloadResBtn").on("click", () => loadAssets(app));

$("#addImageComponentBtn").on("click", () => addNewImage());
$("#addShapeComponentBtn").on("click", () => addNewShape());
$("#addTextComponentBtn").on("click", () => addNewText());

$("#modifyDataBtn").on("click", () => openExcelFile());
$("#updateDataBtn").on("click", () => checkForFileUpdate());


/*        
GLOBAL
*/

export function updateElementsCounter() {
  var currentIndex = app.currentIndex;

  //INDEX
  if (currentCollection.elements.data.length > 0) {
    cardCounterDivLabel.innerHTML = `Élément ${currentIndex + 1} sur ${currentCollection.elements.data.length}`;
  } else {
    cardCounterDivLabel.innerHTML = "PAS DE CARTE À AFFICHER";
  }

  if (app.currentIndex != 0) {
    prevCardBtn.disabled = false;
    bigPrevCardBtn.disabled = false;
  } else {
    prevCardBtn.disabled = true;
    bigPrevCardBtn.disabled = true;
  }

  if (currentCollection.elements.data.length > 0 && app.currentIndex != currentCollection.elements.data.length - 1) {
    nextCardBtn.disabled = false;
    bigNextCardBtn.disabled = false;
  } else {
    nextCardBtn.disabled = true;
    bigNextCardBtn.disabled = true;
  }
}

export function goToOtherCard(delta) {
  app.currentIndex = Math.min(Math.max(parseInt(app.currentIndex + delta), 0), currentCollection.elements.data.length - 1);
  renderCardUsingTemplate(app, app.currentIndex, currentCollection.collectionInfo.visualGuide);
  updateElementsCounter();
  updateDataView();
  rootElement.style.setProperty("--cardAngle", 3 - app.random() * 6 + "deg");
}

export function populateEditionFields() {
  collectionNameInput.value = currentCollection.collectionInfo.collectionName;
  mainTitleDiv.innerHTML = currentCollection?.collectionInfo.collectionName;
  elementFormatSelect.value = currentCollection.collectionInfo.elementFormat;
  elementWidthInput.value = currentCollection.collectionInfo.W;
  elementHeightInput.value = currentCollection.collectionInfo.H;
  visualGuideSelect.value = currentCollection.collectionInfo.visualGuide;

  // pageFormatSelect.value = currentCollection.collectionInfo.pageFormat;
  // pageOrientationSelect.value = currentCollection.collectionInfo.pageOrientation;
  // pageWidthInput.value = currentCollection.collectionInfo.pageWidth;
  // pageHeightInput.value = currentCollection.collectionInfo.pageHeight;
  // pageResolutionInput.value = currentCollection.collectionInfo.resolution;
  // cuttingHelpInput.value = currentCollection.collectionInfo.cuttingHelp;
}

export function checkOtherInputs(eventTargetId, eventTargetValue) {
  switch (eventTargetId) {
    case "elementFormatSelect":
      if (eventTargetValue === "custom") {
        elementHeightInput.disabled = false;
        elementWidthInput.disabled = false;
        populateEditionFields();
      } else {
        elementHeightInput.disabled = true;
        elementWidthInput.disabled = true;
      }
      break;

    case "pageFormat":
      if (eventTargetValue === "custom") {
        pageWidthInput.disabled = false;
        pageHeight.disabled = false;
        pageOrientationSelect.disabled = true;
        populateEditionFields();
      } else {
        pageWidthInput.disabled = true;
        pageHeightInput.disabled = true;
        pageOrientationSelect.disabled = false;
      }
      break;
  }
}

export function moveComponent(currentIndex, delta) {
  var allAccordions = templateItemsDiv.querySelectorAll(".accordion");

  var destinationIndex = currentIndex + delta;
  var currentElement = { ...currentCollection.template[currentIndex] };
  var destinationElement = { ...currentCollection.template[destinationIndex] };

  currentCollection.template[destinationIndex] = currentElement;
  currentCollection.template[currentIndex] = destinationElement;

  allAccordions[currentIndex].style.translate = "0 " + 145 * delta + "%";
  allAccordions[destinationIndex].style.translate = "0 " + 145 * -delta + "%";

  setTimeout(() => {
    setupComponents();
    generateCollectionBtn.click();
  }, 200);
}
